import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, INDENT_CONTENT_COMMAND, LexicalEditor, OUTDENT_CONTENT_COMMAND } from "lexical";
import { useEffect } from "react";
import { applyTextCase, clearFormatting, insertLinkPrompt, setBlockType, stepFontSize, toggleList } from "../richTextActions";
import { matchesShortcut, ShortcutName } from "../shortcuts";

// Wires up every custom keyboard shortcut the toolbar/dropdowns advertise (see shortcuts.ts) to
// the same shared actions their buttons call - Bold/Italic/Underline/Undo/Redo are deliberately
// absent here, since Lexical's core rich-text and history handling already bind those natively;
// registering them again here would just be redundant (or risk double-firing).
function buildActions(editor: LexicalEditor): Partial<Record<ShortcutName, () => void>> {
  return {
    NORMAL: () => setBlockType(editor, "paragraph"),
    HEADING1: () => setBlockType(editor, "h1"),
    HEADING2: () => setBlockType(editor, "h2"),
    HEADING3: () => setBlockType(editor, "h3"),
    NUMBERED_LIST: () => toggleList(editor, "number"),
    BULLET_LIST: () => toggleList(editor, "bullet"),
    CHECK_LIST: () => toggleList(editor, "check"),
    CODE_BLOCK: () => setBlockType(editor, "code"),
    QUOTE: () => setBlockType(editor, "quote"),
    INCREASE_FONT_SIZE: () => stepFontSize(editor, 1),
    DECREASE_FONT_SIZE: () => stepFontSize(editor, -1),
    INSERT_CODE_BLOCK: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code"),
    STRIKETHROUGH: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
    LOWERCASE: () => applyTextCase(editor, "lowercase"),
    UPPERCASE: () => applyTextCase(editor, "uppercase"),
    CAPITALIZE: () => applyTextCase(editor, "capitalize"),
    CENTER_ALIGN: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center"),
    JUSTIFY_ALIGN: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify"),
    LEFT_ALIGN: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left"),
    RIGHT_ALIGN: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right"),
    SUBSCRIPT: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript"),
    SUPERSCRIPT: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript"),
    INDENT: () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
    OUTDENT: () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
    CLEAR_FORMATTING: () => clearFormatting(editor),
    INSERT_LINK: () => insertLinkPrompt(editor),
  };
}

function ShortcutsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const actions = buildActions(editor);
    const names = Object.keys(actions) as ShortcutName[];

    const onKeyDown = (event: KeyboardEvent) => {
      const name = names.find((candidate) => matchesShortcut(event, candidate));
      if (!name) return;

      event.preventDefault();
      actions[name]?.();
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener("keydown", onKeyDown);
      rootElement?.addEventListener("keydown", onKeyDown);
    });
  }, [editor]);

  return null;
}

export default ShortcutsPlugin;
