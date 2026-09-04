import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent, $insertNodeToNearestRoot, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  createCommand,
  INSERT_PARAGRAPH_COMMAND,
} from "lexical";
import { useEffect } from "react";
import { $createCollapsibleContainerNode, $isCollapsibleContainerNode, CollapsibleContainerNode } from "../nodes/CollapsibleContainerNode";
import { $createCollapsibleContentNode, $isCollapsibleContentNode, CollapsibleContentNode } from "../nodes/CollapsibleContentNode";
import { $createCollapsibleTitleNode, $isCollapsibleTitleNode, CollapsibleTitleNode } from "../nodes/CollapsibleTitleNode";

export const INSERT_COLLAPSIBLE_COMMAND = createCommand<void>("INSERT_COLLAPSIBLE_COMMAND");

// Registers the 3-node structure (Container > Title + Content) collapsible sections rely on:
// structure-enforcing transforms that unwrap a title/content node found outside a container (e.g.
// after a paste that split them apart) back into regular blocks, and the insert command the
// toolbar/slash-menu dispatch.
function CollapsiblePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => mergeRegister(
    editor.registerNodeTransform(CollapsibleContentNode, (node) => {
      const parent = node.getParent();
      if (!$isCollapsibleContainerNode(parent)) {
        node.getChildren().forEach((child) => node.insertBefore(child));
        node.remove();

        return;
      }
      if (node.isEmpty()) node.append($createParagraphNode());
    }),
    editor.registerNodeTransform(CollapsibleTitleNode, (node) => {
      const parent = node.getParent();
      if (!$isCollapsibleContainerNode(parent)) {
        const paragraph = $createParagraphNode();
        node.getChildren().forEach((child) => paragraph.append(child));
        node.replace(paragraph);
      }
    }),
    editor.registerNodeTransform(CollapsibleContainerNode, (node) => {
      const children = node.getChildren();
      const isValid = children.length === 2
        && $isCollapsibleTitleNode(children[0])
        && $isCollapsibleContentNode(children[1]);
      if (!isValid) {
        children.forEach((child) => node.insertBefore(child));
        node.remove();
      }
    }),
    // Enter inside the title moves the caret into the content instead of splitting the title into
    // two lines. This has to be a command override, not `CollapsibleTitleNode.insertNewAfter` -
    // Enter's default handling calls `insertNewAfter` on the *paragraph* the title wraps (the
    // nearest node that actually overrides it), not on the title itself, so an override there is
    // never reached.
    editor.registerCommand(INSERT_PARAGRAPH_COMMAND, () => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;

      const titleNode = $findMatchingParent(selection.anchor.getNode(), $isCollapsibleTitleNode);
      if (!titleNode) return false;

      const container = titleNode.getParent();
      if (!$isCollapsibleContainerNode(container)) return false;

      if (!container.getOpen()) container.setOpen(true);
      container.getChildAtIndex(1)?.selectStart();

      return true;
    }, COMMAND_PRIORITY_LOW),
    editor.registerCommand(INSERT_COLLAPSIBLE_COMMAND, () => {
      editor.update(() => {
        const titleParagraph = $createParagraphNode();
        const title = $createCollapsibleTitleNode().append(titleParagraph);
        const content = $createCollapsibleContentNode().append($createParagraphNode());
        const container = $createCollapsibleContainerNode(true).append(title, content);
        $insertNodeToNearestRoot(container);
        titleParagraph.select();
      });

      return true;
    }, COMMAND_PRIORITY_EDITOR),
  ), [editor]);

  return null;
}

export default CollapsiblePlugin;
