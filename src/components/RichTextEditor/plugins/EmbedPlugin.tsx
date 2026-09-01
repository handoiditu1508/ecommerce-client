import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR, LexicalCommand, LexicalEditor, createCommand } from "lexical";
import { useEffect } from "react";
import { $createEmbedNode, EmbedProvider, resolveEmbedUrl } from "../nodes/EmbedNode";

export const INSERT_EMBED_COMMAND: LexicalCommand<{ url: string; embedUrl: string; provider: EmbedProvider; }> = createCommand("INSERT_EMBED_COMMAND");

/** Returns false when the URL doesn't match a supported provider (YouTube/Vimeo) and nothing was inserted. */
export function insertEmbed(editor: LexicalEditor, url: string): boolean {
  const resolved = resolveEmbedUrl(url);
  if (!resolved) return false;

  editor.dispatchCommand(INSERT_EMBED_COMMAND, { url, ...resolved });

  return true;
}

function EmbedPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => editor.registerCommand(
    INSERT_EMBED_COMMAND,
    ({ url, embedUrl, provider }) => {
      $insertNodes([$createEmbedNode(url, embedUrl, provider)]);

      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  ), [editor]);

  return null;
}

export default EmbedPlugin;
