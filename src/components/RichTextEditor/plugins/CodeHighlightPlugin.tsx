import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

// Live Prism-based syntax highlighting for code blocks - the actual tokenizing/reconciliation is
// entirely owned by this official Lexical helper (also registers Tab-key code indentation); this
// plugin only needs to invoke it once the editor exists. `CodeHighlightNode` (registered alongside
// `CodeNode` in RichTextEditor.tsx) is required by `registerCodeHighlighting` or it throws.
function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => registerCodeHighlighting(editor), [editor]);

  return null;
}

export default CodeHighlightPlugin;
