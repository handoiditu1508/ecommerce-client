import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { $insertNodes, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { useEffect } from "react";
import { $createImageNode } from "../nodes/ImageNode";
import { getLocalImageRegistry } from "../useLocalImageRegistry";

// Shared with any consumer-supplied "insert from library" UI (see RichTextEditor's
// `renderImagePicker` prop) - kept here, next to `insertImageFromUrl`, rather than in
// RichTextEditor.tsx, so the toolbar can depend on this module without a circular import.
export type ImagePickerSelection = { src: string; altText?: string; };
export type ImagePickerRenderProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (image: ImagePickerSelection) => void;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<{ file: File; }> = createCommand("INSERT_IMAGE_COMMAND");
// Distinct from INSERT_IMAGE_COMMAND: the src here is already a persisted path (e.g. picked from
// an existing image library), so it's inserted as a resolved node straight away - no local
// File/object-URL registry entry, no pending-upload state.
export const INSERT_IMAGE_URL_COMMAND: LexicalCommand<{ src: string; altText: string; }> = createCommand("INSERT_IMAGE_URL_COMMAND");

export function insertImage(editor: LexicalEditor, file: File): void {
  editor.dispatchCommand(INSERT_IMAGE_COMMAND, { file });
}

export function insertImageFromUrl(editor: LexicalEditor, src: string, altText: string): void {
  editor.dispatchCommand(INSERT_IMAGE_URL_COMMAND, { src, altText });
}

function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => mergeRegister(
    editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      ({ file }) => {
        const localId = getLocalImageRegistry(editor).registerLocalFile(file);
        $insertNodes([$createImageNode("", file.name, localId)]);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand(
      INSERT_IMAGE_URL_COMMAND,
      ({ src, altText }) => {
        $insertNodes([$createImageNode(src, altText)]);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
  ), [editor]);

  return null;
}

export default ImagesPlugin;
