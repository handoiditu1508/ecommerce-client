import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getNodeByKey,
  $isParagraphNode,
  $isTextNode,
  NodeKey,
} from "lexical";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SupportActionMenu, { SupportAction } from "@/components/SupportActionMenu";
import { insertImage } from "./ImagesPlugin";
import { ComponentPickerOption, useComponentPickerOptions } from "./ComponentPickerPlugin";

const MENU_CLASS = "rte-draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${MENU_CLASS}`);
}

// Drag-to-reorder handle for top-level blocks, matching the Lexical playground's own pattern: a
// grip icon (drag mechanics entirely owned by the official `DraggableBlockPlugin_EXPERIMENTAL` -
// this component only supplies the handle/target-line UI) plus a "+" button that reuses the same
// insertable-block list as the "/" slash menu (`useComponentPickerOptions`), inserting the chosen
// block right after (or before, with Alt/Ctrl-click) the hovered block.
function DraggableBlockPlugin({ anchorElem }: { anchorElem: HTMLElement | null; }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const hiddenImageInputRef = useRef<HTMLInputElement>(null);
  const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [insertBefore, setInsertBefore] = useState(false);
  // Captured at "+"-click time, not re-derived when an option is chosen - by then the pointer has
  // moved onto the (portalled, outside `.rte-draggable-block-menu`) popup menu, which the official
  // plugin's own hover tracking sees as "left the block" and clears `draggableElement` for.
  const targetNodeKeyRef = useRef<NodeKey | null>(null);
  const options = useComponentPickerOptions(editor, hiddenImageInputRef);

  const openMenu = useCallback((anchor: HTMLElement, withInsertBefore: boolean) => {
    if (!draggableElement) return;

    editor.read("latest", () => {
      targetNodeKeyRef.current = $getNearestNodeFromDOMNode(draggableElement)?.getKey() ?? null;
    });
    if (!targetNodeKeyRef.current) return;

    setInsertBefore(withInsertBefore);
    setMenuAnchor(anchor);
  }, [draggableElement, editor]);

  // Mirrors the playground's own approach: create an empty paragraph next to the target block,
  // move selection into it, then run the option's normal onSelect (which, like the slash menu,
  // acts on the current selection) - so the same option list works from a non-text-cursor trigger.
  // The three steps below are deliberately three separate (not nested) `editor.update()` calls:
  // `option.onSelect()` (and the commands some options dispatch) call `editor.update()` themselves,
  // and a nested `editor.update()` call is queued to run *after* the outer one commits rather than
  // inline - so a single wrapping update here would run the empty-placeholder cleanup before
  // onSelect's queued mutation ever executes, deleting the (still-empty) placeholder out from under
  // it and leaving selection to fall back onto the original target node instead.
  const selectOption = useCallback((option: ComponentPickerOption) => {
    setMenuAnchor(null);
    const nodeKey = targetNodeKeyRef.current;
    if (!nodeKey) return;

    let placeholderKey: NodeKey | null = null;
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return;

      const placeholder = $createParagraphNode();
      const textNode = $createTextNode("");
      placeholder.append(textNode);
      if (insertBefore) node.insertBefore(placeholder);
      else node.insertAfter(placeholder);
      textNode.select();
      placeholderKey = placeholder.getKey();
    });
    if (!placeholderKey) return;
    const insertedPlaceholderKey = placeholderKey;

    option.onSelect();

    editor.update(() => {
      const latestPlaceholder = $getNodeByKey(insertedPlaceholderKey);
      if ($isParagraphNode(latestPlaceholder)) {
        const onlyChild = latestPlaceholder.getFirstChild();
        const isEmptyPlaceholder = $isTextNode(onlyChild)
          && onlyChild.getTextContent().length === 0
          && latestPlaceholder.getChildrenSize() === 1;
        if (isEmptyPlaceholder) latestPlaceholder.remove();
      }
    });
  }, [editor, insertBefore]);

  const menuItems = useMemo<SupportAction[]>(() => options.map((option) => ({
    key: option.key,
    label: option.title,
    idleIcon: option.icon,
    actionHandler: () => selectOption(option),
  })), [options, selectOption]);

  if (!anchorElem) return null;

  return (
    <>
      <input
        ref={hiddenImageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          Array.from(event.currentTarget.files ?? []).forEach((file) => insertImage(editor, file));
          event.currentTarget.value = "";
        }}
      />
      {/* eslint-disable-next-line @stylistic/jsx-pascal-case -- official Lexical export name */}
      <DraggableBlockPlugin_EXPERIMENTAL
        anchorElem={anchorElem}
        menuRef={menuRef}
        targetLineRef={targetLineRef}
        isOnMenu={isOnMenu}
        menuComponent={(
          <div
            ref={menuRef}
            className={MENU_CLASS}
            style={{ position: "absolute", left: 0, top: 0, display: "none", gap: 2, opacity: 0 }}
          >
            <Tooltip title={t("insert")}>
              <IconButton
                size="small"
                onClick={(event) => openMenu(event.currentTarget, event.altKey || event.ctrlKey)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("drag_to_reorder")}>
              <IconButton size="small" sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}>
                <DragIndicatorIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
        targetLineComponent={(
          <div
            ref={targetLineRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: 4,
              opacity: 0,
              backgroundColor: theme.vars.palette.primary.main,
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
        )}
        onElementChanged={setDraggableElement}
      />
      <SupportActionMenu
        items={menuItems}
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      />
    </>
  );
}

export default DraggableBlockPlugin;
