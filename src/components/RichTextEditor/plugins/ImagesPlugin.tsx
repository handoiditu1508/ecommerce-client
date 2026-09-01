import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { useEffect } from "react";
import { $createImageNode } from "../nodes/ImageNode";
import { getLocalImageRegistry } from "../useLocalImageRegistry";

export const INSERT_IMAGE_COMMAND: LexicalCommand<{ file: File; }> = createCommand("INSERT_IMAGE_COMMAND");

export function insertImage(editor: LexicalEditor, file: File): void {
  editor.dispatchCommand(INSERT_IMAGE_COMMAND, { file });
}

function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => editor.registerCommand(
    INSERT_IMAGE_COMMAND,
    ({ file }) => {
      const localId = getLocalImageRegistry(editor).registerLocalFile(file);
      $insertNodes([$createImageNode("", file.name, localId)]);

      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  ), [editor]);

  return null;
}

export default ImagesPlugin;
