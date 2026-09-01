import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_HIGH, DROP_COMMAND, PASTE_COMMAND } from "lexical";
import { useEffect } from "react";
import { insertImage } from "./ImagesPlugin";

function getImageFiles(fileList: FileList | null | undefined): File[] {
  return Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
}

/** Routes pasted/dropped images into the same insertion path as the toolbar's image button. */
function ImageDropPastePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterPaste = editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent)) return false;
        const files = getImageFiles(event.clipboardData?.files);
        if (!files.length) return false;

        files.forEach((file) => insertImage(editor, file));
        event.preventDefault();

        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    const unregisterDrop = editor.registerCommand(
      DROP_COMMAND,
      (event) => {
        const files = getImageFiles(event.dataTransfer?.files);
        if (!files.length) return false;

        files.forEach((file) => insertImage(editor, file));
        event.preventDefault();

        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    return () => {
      unregisterPaste();
      unregisterDrop();
    };
  }, [editor]);

  return null;
}

export default ImageDropPastePlugin;
