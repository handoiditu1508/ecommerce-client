import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertTableColumnAtNode,
  $insertTableRowAtNode,
  $isTableCellNode,
  $isTableRowNode,
  getDOMCellFromTarget,
  TableCellNode,
} from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { $getNearestNodeFromDOMNode, isHTMLElement, registerEventListener, registerEventListeners } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const BUTTON_SIZE = 22;

// Small hover-triggered "add row"/"add column" buttons at a table's bottom/right edge, simplified
// from the playground's own `TableHoverActionsV2Plugin` - that version also supports column
// drag-reordering and ascending/descending sort, both dropped here as unneeded complexity for a
// product-description field (and both need extra dependencies - @atlaskit/pragmatic-drag-and-drop,
// @floating-ui/react - this project doesn't otherwise have).
function TableHoverActions() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredTable, setHoveredTable] = useState<HTMLElement | null>(null);

  const getLastCell = useCallback((): TableCellNode | null => {
    let lastCell: TableCellNode | null = null;
    if (!hoveredTable) return null;

    editor.read("latest", () => {
      const anyCell = getDOMCellFromTarget(hoveredTable.querySelector("td, th"));
      const tableCellNode = anyCell && $getNearestNodeFromDOMNode(anyCell.elem);
      if (!$isTableCellNode(tableCellNode)) return;

      const tableNode = tableCellNode.getParent()?.getParent();
      const rows = tableNode?.getChildren().filter($isTableRowNode) ?? [];
      const lastRow = rows[rows.length - 1];
      const cells = lastRow?.getChildren().filter($isTableCellNode) ?? [];
      lastCell = cells[cells.length - 1] ?? null;
    });

    return lastCell;
  }, [editor, hoveredTable]);

  const addRow = useCallback(() => {
    const cell = getLastCell();
    if (cell) editor.update(() => $insertTableRowAtNode(cell, true));
  }, [editor, getLastCell]);

  const addColumn = useCallback(() => {
    const cell = getLastCell();
    if (cell) editor.update(() => $insertTableColumnAtNode(cell, true));
  }, [editor, getLastCell]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const target = event.target;
      if (!isHTMLElement(target)) return;
      if (containerRef.current?.contains(target)) return;

      const cell = getDOMCellFromTarget(target);
      const tableElement = cell?.elem.closest("table") ?? null;
      setHoveredTable((current) => (current === tableElement ? current : tableElement));
    };

    const onPointerLeaveDocument = (event: PointerEvent) => {
      const related = event.relatedTarget;
      const rootElement = editor.getRootElement();
      if (isHTMLElement(related) && (rootElement?.contains(related) || containerRef.current?.contains(related))) return;
      setHoveredTable(null);
    };

    const resizerContainer = containerRef.current;

    return mergeRegister(
      editor.registerRootListener((rootElement) => {
        if (!rootElement) return undefined;

        return registerEventListeners(rootElement, { pointermove: onPointerMove });
      }),
      resizerContainer
        ? registerEventListener(resizerContainer, "pointermove", onPointerMove, { capture: true })
        : () => {},
      registerEventListener(document, "pointerout", onPointerLeaveDocument),
    );
  }, [editor]);

  const tableRect = hoveredTable?.getBoundingClientRect();

  return (
    <div ref={containerRef}>
      {tableRect && (
        <>
          <Tooltip title={t("insert_row_below")}>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                zIndex: 2,
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                left: (window.scrollX + tableRect.left + (tableRect.width / 2)) - (BUTTON_SIZE / 2),
                top: window.scrollY + tableRect.bottom + 2,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={addRow}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("insert_column_right")}>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                zIndex: 2,
                width: BUTTON_SIZE,
                height: BUTTON_SIZE,
                left: window.scrollX + tableRect.right + 2,
                top: (window.scrollY + tableRect.top + (tableRect.height / 2)) - (BUTTON_SIZE / 2),
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={addColumn}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </div>
  );
}

function TableHoverActionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const portalTarget = editor.getRootElement()?.ownerDocument?.body ?? document.body;

  return createPortal(<TableHoverActions />, portalTarget);
}

export default TableHoverActionsPlugin;
