import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $computeTableMapSkipCellCheck,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $isTableCellNode,
  $isTableRowNode,
  getDOMCellFromTarget,
  getTableElement,
  TableCellNode,
  TableDOMCell,
  TableMapType,
  TableNode,
} from "@lexical/table";
import { calculateZoomLevel, mergeRegister } from "@lexical/utils";
import { useTheme } from "@mui/material/styles";
import {
  $getNearestNodeFromDOMNode,
  isHTMLElement,
  LexicalEditor,
  NodeKey,
  registerEventListener,
  registerEventListeners,
  SKIP_SCROLL_INTO_VIEW_TAG,
} from "lexical";
import { CSSProperties, PointerEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type PointerPosition = { x: number; y: number; };

type PointerDraggingDirection = "right" | "bottom";

const MIN_ROW_HEIGHT = 33;
const MIN_COLUMN_WIDTH = 92;
const ZONE_WIDTH = 16;

function getCellNodeHeight(cell: TableCellNode, activeEditor: LexicalEditor): number | undefined {
  return activeEditor.getElementByKey(cell.getKey())?.clientHeight;
}

function getCellColumnIndex(tableCellNode: TableCellNode, tableMap: TableMapType) {
  for (let row = 0; row < tableMap.length; row++) {
    for (let column = 0; column < tableMap[row].length; column++) {
      if (tableMap[row][column].cell === tableCellNode) return column;
    }
  }

  return undefined;
}

// Column-width / row-height drag resizing for tables, ported from the Lexical playground's own
// `TableCellResizer` (no official package for this - both playground and this port hand-roll the
// pointer-event math). A transparent overlay portalled to <body> tracks the hovered cell and
// renders two thin drag zones (right edge / bottom edge) directly over the real table, since the
// resize handles need to sit above the table regardless of where in the DOM tree the table lives.
function TableCellResizer({ editor }: { editor: LexicalEditor; }) {
  const theme = useTheme();
  const activeColor = theme.vars.palette.primary.main;

  const targetRef = useRef<HTMLElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const tableRectRef = useRef<DOMRect | null>(null);
  const [hasTable, setHasTable] = useState(false);

  const pointerStartPosRef = useRef<PointerPosition | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => resizeCleanupRef.current?.(), []);
  const [pointerCurrentPos, setPointerCurrentPos] = useState<PointerPosition | null>(null);

  const [activeCell, setActiveCell] = useState<TableDOMCell | null>(null);
  const [draggingDirection, setDraggingDirection] = useState<PointerDraggingDirection | null>(null);
  const [hoveredDirection, setHoveredDirection] = useState<PointerDraggingDirection | null>(null);

  const resetState = useCallback(() => {
    setActiveCell(null);
    targetRef.current = null;
    setDraggingDirection(null);
    setHoveredDirection(null);
    pointerStartPosRef.current = null;
    tableRectRef.current = null;
  }, []);

  useEffect(() => {
    const tableKeys = new Set<NodeKey>();

    return mergeRegister(
      editor.registerMutationListener(TableNode, (nodeMutations) => {
        nodeMutations.forEach((mutation, nodeKey) => {
          if (mutation === "destroyed") tableKeys.delete(nodeKey);
          else tableKeys.add(nodeKey);
        });
        setHasTable(tableKeys.size > 0);
      }),
      editor.registerNodeTransform(TableNode, (tableNode) => {
        if (tableNode.getColWidths()) return tableNode;
        tableNode.setColWidths(Array(tableNode.getColumnCount()).fill(MIN_COLUMN_WIDTH));

        return tableNode;
      }),
    );
  }, [editor]);

  useEffect(() => {
    if (!hasTable) return;

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target;
      if (!isHTMLElement(target)) return;

      if (draggingDirection) {
        event.preventDefault();
        event.stopPropagation();
        setPointerCurrentPos({ x: event.clientX, y: event.clientY });

        return;
      }
      if (resizerRef.current?.contains(target)) return;

      if (targetRef.current !== target) {
        targetRef.current = target;
        const cell = getDOMCellFromTarget(target);

        if (cell && activeCell !== cell) {
          editor.read("latest", () => {
            const tableCellNode = $getNearestNodeFromDOMNode(cell.elem);
            if (!tableCellNode) return;

            const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
            const tableElement = getTableElement(tableNode, editor.getElementByKey(tableNode.getKey()));
            if (!tableElement) return;

            targetRef.current = target;
            tableRectRef.current = tableElement.getBoundingClientRect();
            setActiveCell(cell);
          });
        } else if (cell == null) {
          resetState();
        }
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") onPointerMove(event);
    };

    const resizerContainer = resizerRef.current;

    return mergeRegister(
      editor.registerRootListener((rootElement) => {
        if (!rootElement) return undefined;

        return registerEventListeners(rootElement, { pointerdown: onPointerDown, pointermove: onPointerMove });
      }),
      resizerContainer
        ? registerEventListener(resizerContainer, "pointermove", onPointerMove, { capture: true })
        : () => {},
    );
  }, [activeCell, draggingDirection, editor, resetState, hasTable]);

  const updateRowHeight = useCallback((heightChange: number) => {
    if (!activeCell) return;

    editor.update(() => {
      const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
      if (!$isTableCellNode(tableCellNode)) return;

      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
      const baseRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);
      const tableRows = tableNode.getChildren();
      const isFullRowMerge = tableCellNode.getColSpan() === tableNode.getColumnCount();
      const tableRowIndex = isFullRowMerge ? baseRowIndex : baseRowIndex + tableCellNode.getRowSpan() - 1;
      if (tableRowIndex >= tableRows.length || tableRowIndex < 0) return;

      const tableRow = tableRows[tableRowIndex];
      if (!$isTableRowNode(tableRow)) return;

      let height = tableRow.getHeight();
      if (height === undefined) {
        const rowCells = tableRow.getChildren().filter($isTableCellNode);
        height = Math.min(...rowCells.map((cell) => getCellNodeHeight(cell, editor) ?? Infinity));
      }
      tableRow.setHeight(Math.max(height + heightChange, MIN_ROW_HEIGHT));
    }, { tag: SKIP_SCROLL_INTO_VIEW_TAG });
  }, [activeCell, editor]);

  const updateColumnWidth = useCallback((widthChange: number) => {
    if (!activeCell) return;

    editor.update(() => {
      const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
      if (!$isTableCellNode(tableCellNode)) return;

      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
      const [tableMap] = $computeTableMapSkipCellCheck(tableNode, null, null);
      const columnIndex = getCellColumnIndex(tableCellNode, tableMap);
      if (columnIndex === undefined) return;

      const colWidths = tableNode.getColWidths();
      const width = colWidths?.[columnIndex];
      if (!colWidths || width === undefined) return;

      const newColWidths = [...colWidths];
      newColWidths[columnIndex] = Math.max(width + widthChange, MIN_COLUMN_WIDTH);
      tableNode.setColWidths(newColWidths);
    }, { tag: SKIP_SCROLL_INTO_VIEW_TAG });
  }, [activeCell, editor]);

  const pointerUpHandler = useCallback((direction: PointerDraggingDirection) => (event: PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!activeCell || !pointerStartPosRef.current) return;

    const { x, y } = pointerStartPosRef.current;
    const zoom = calculateZoomLevel(event.target as Element);
    if (direction === "bottom") updateRowHeight((event.clientY - y) / zoom);
    else updateColumnWidth((event.clientX - x) / zoom);

    resetState();
    resizeCleanupRef.current?.();
    resizeCleanupRef.current = null;
  }, [activeCell, resetState, updateColumnWidth, updateRowHeight]);

  const toggleResize = useCallback((
    direction: PointerDraggingDirection,
  ): PointerEventHandler<HTMLDivElement> => (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!activeCell) return;

    pointerStartPosRef.current = { x: event.clientX, y: event.clientY };
    setPointerCurrentPos(pointerStartPosRef.current);
    setDraggingDirection(direction);

    resizeCleanupRef.current?.();
    resizeCleanupRef.current = registerEventListener(activeCell.elem.ownerDocument, "pointerup", pointerUpHandler(direction));
  }, [activeCell, pointerUpHandler]);

  const handlePointerEnter = useCallback((
    direction: PointerDraggingDirection,
  ): PointerEventHandler<HTMLDivElement> => () => {
    if (!draggingDirection) setHoveredDirection(direction);
  }, [draggingDirection]);

  const handlePointerLeave = useCallback(() => {
    if (!draggingDirection) setHoveredDirection(null);
  }, [draggingDirection]);

  const getResizers = useCallback((): Record<PointerDraggingDirection, CSSProperties | null> => {
    if (!activeCell) return { bottom: null, right: null };

    const { height, width, top, left } = activeCell.elem.getBoundingClientRect();
    const zoom = calculateZoomLevel(activeCell.elem);
    const base: CSSProperties = { position: "absolute", touchAction: "none", backgroundColor: "transparent" };
    const styles: Record<PointerDraggingDirection, CSSProperties> = {
      bottom: {
        ...base,
        cursor: "row-resize",
        height: ZONE_WIDTH,
        left: window.scrollX + left,
        top: (window.scrollY + top + height) - (ZONE_WIDTH / 2),
        width,
      },
      right: {
        ...base,
        cursor: "col-resize",
        height,
        left: (window.scrollX + left + width) - (ZONE_WIDTH / 2),
        top: window.scrollY + top,
        width: ZONE_WIDTH,
      },
    };

    const tableRect = tableRectRef.current;

    if (draggingDirection && pointerCurrentPos && tableRect) {
      const active = styles[draggingDirection];
      if (draggingDirection === "bottom") {
        active.left = window.scrollX + tableRect.left;
        active.top = window.scrollY + (pointerCurrentPos.y / zoom);
        active.height = 3;
        active.width = tableRect.width;
      } else {
        active.top = window.scrollY + tableRect.top;
        active.left = window.scrollX + (pointerCurrentPos.x / zoom);
        active.width = 3;
        active.height = tableRect.height;
      }
      active.backgroundColor = activeColor;
    } else if (!draggingDirection && hoveredDirection === "right" && tableRect) {
      styles.right.backgroundColor = activeColor;
      styles.right.top = window.scrollY + tableRect.top;
      styles.right.height = tableRect.height;
    }

    return styles;
  }, [activeCell, draggingDirection, hoveredDirection, pointerCurrentPos, activeColor]);

  const resizerStyles = getResizers();

  return (
    <div ref={resizerRef}>
      {activeCell != null && (
        <>
          <div
            style={resizerStyles.right ?? undefined}
            onPointerEnter={handlePointerEnter("right")}
            onPointerLeave={handlePointerLeave}
            onPointerDown={toggleResize("right")}
          />
          <div style={resizerStyles.bottom ?? undefined} onPointerDown={toggleResize("bottom")} />
        </>
      )}
    </div>
  );
}

function TableCellResizerPlugin() {
  const [editor] = useLexicalComposerContext();
  const portalTarget = editor.getRootElement()?.ownerDocument?.body ?? document.body;

  return createPortal(<TableCellResizer editor={editor} />, portalTarget);
}

export default TableCellResizerPlugin;
