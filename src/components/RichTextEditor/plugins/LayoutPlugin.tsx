import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  KEY_TAB_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { $createLayoutContainerNode, $isLayoutContainerNode, LayoutContainerNode } from "../nodes/LayoutContainerNode";
import { $createLayoutItemNode, $isLayoutItemNode, LayoutItemNode } from "../nodes/LayoutItemNode";

// A grid `template-columns` string, e.g. "1fr 1fr" for two equal columns.
export const INSERT_LAYOUT_COMMAND = createCommand<string>("INSERT_LAYOUT_COMMAND");

// Mirrors the Lexical playground's own InsertLayoutDialog preset list exactly (both the templates
// and their order) - shared by the Insert menu's layout popover and the slash-command menu, so
// both expose the same set instead of each hand-rolling a subset.
export const LAYOUT_PRESETS: { labelKey: string; template: string; }[] = [
  { labelKey: "layout_two_columns_equal", template: "1fr 1fr" },
  { labelKey: "layout_two_columns_25_75", template: "1fr 3fr" },
  { labelKey: "layout_three_columns_equal", template: "1fr 1fr 1fr" },
  { labelKey: "layout_three_columns_25_50_25", template: "1fr 2fr 1fr" },
  { labelKey: "layout_four_columns_equal", template: "1fr 1fr 1fr 1fr" },
];

// Registers the 2-node structure (Container > Item*) fixed-column layouts rely on: a
// structure-enforcing transform that unwraps a stray item found outside a container back into
// regular blocks, and the insert command the toolbar/slash-menu dispatch.
function LayoutPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => mergeRegister(
    editor.registerNodeTransform(LayoutItemNode, (node) => {
      const parent = node.getParent();
      if (!$isLayoutContainerNode(parent)) {
        node.getChildren().forEach((child) => node.insertBefore(child));
        node.remove();

        return;
      }
      if (node.isEmpty()) node.append($createParagraphNode());
    }),
    editor.registerNodeTransform(LayoutContainerNode, (node) => {
      const children = node.getChildren();
      if (!children.every($isLayoutItemNode)) {
        children.forEach((child) => node.insertBefore(child));
        node.remove();
      }
    }),
    // Tab/Shift+Tab moves between columns - without this, TabIndentationPlugin's default handling
    // (indent, or a literal tab character) would fire instead, with no other keyboard way to reach
    // the next column.
    editor.registerCommand(KEY_TAB_COMMAND, (event) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      const itemNode = $findMatchingParent(selection.anchor.getNode(), $isLayoutItemNode);
      if (!itemNode) return false;

      const sibling = event.shiftKey ? itemNode.getPreviousSibling() : itemNode.getNextSibling();
      if (!$isLayoutItemNode(sibling)) return false;

      event.preventDefault();
      sibling.selectStart();

      return true;
    }, COMMAND_PRIORITY_LOW),
    editor.registerCommand(INSERT_LAYOUT_COMMAND, (template) => {
      editor.update(() => {
        const container = $createLayoutContainerNode(template);
        const itemsCount = template.trim().split(/\s+/).length;
        for (let i = 0; i < itemsCount; i++) {
          container.append($createLayoutItemNode().append($createParagraphNode()));
        }
        $insertNodeToNearestRoot(container);
        container.selectStart();
      });

      return true;
    }, COMMAND_PRIORITY_EDITOR),
  ), [editor]);

  return null;
}

export default LayoutPlugin;
