import { $createCodeNode } from "@lexical/code";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from "@lexical/rich-text";
import { $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { BlockSelectValue, isListType, LIST_COMMANDS } from "./Toolbar/blockTypes";
import { CASE_FORMATS, TEXT_FORMATS, TextCase } from "./Toolbar/formatOptions";

// Shared with the block-type Select (Toolbar.tsx), the "/" slash menu, and ShortcutsPlugin.tsx -
// one implementation so a shortcut and its equivalent toolbar click always do the same thing.
export function setBlockType(editor: LexicalEditor, value: BlockSelectValue): void {
  if (isListType(value)) {
    editor.dispatchCommand(LIST_COMMANDS[value], undefined);

    return;
  }
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (value === "paragraph") $setBlocksType(selection, () => $createParagraphNode());
    else if (value === "quote") $setBlocksType(selection, () => $createQuoteNode());
    else if (value === "code") $setBlocksType(selection, () => $createCodeNode());
    else $setBlocksType(selection, () => $createHeadingNode(value as HeadingTagType));
  });
}

export function toggleList(editor: LexicalEditor, type: "bullet" | "number" | "check"): void {
  editor.dispatchCommand(LIST_COMMANDS[type], undefined);
}

// Mutually exclusive - clears any other active case format before applying the new one. Shared
// between MoreOptionsMenu.tsx, the floating text-format toolbar, and ShortcutsPlugin.tsx.
export function applyTextCase(editor: LexicalEditor, nextCase: TextCase): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    CASE_FORMATS.forEach((format) => {
      if (format !== nextCase && selection.hasFormat(format)) selection.formatText(format);
    });
    if (nextCase !== "none" && !selection.hasFormat(nextCase)) selection.formatText(nextCase);
  });
}

export function clearFormatting(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    // `dispatchCommand` starts its own update cycle, so it can't be called from inside this one -
    // toggle each active format directly on the selection instead.
    TEXT_FORMATS.forEach(({ value }) => {
      if (selection.hasFormat(value)) selection.formatText(value);
    });
    $patchStyleText(selection, { color: null, "background-color": null, "font-family": null, "font-size": null });
  });
}

const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 16;

// Mirrors the Lexical playground's own non-linear stepping (larger jumps at larger sizes),
// shared between FontSizeInput.tsx's +/- buttons and ShortcutsPlugin.tsx's keyboard shortcut.
export function nextFontSize(current: number, direction: 1 | -1): number {
  if (direction === -1) {
    if (current > MAX_FONT_SIZE) return MAX_FONT_SIZE;
    if (current >= 48) return current - 12;
    if (current >= 24) return current - 4;
    if (current >= 14) return current - 2;
    if (current >= 9) return current - 1;

    return MIN_FONT_SIZE;
  }

  if (current < MIN_FONT_SIZE) return MIN_FONT_SIZE;
  if (current < 12) return current + 1;
  if (current < 20) return current + 2;
  if (current < 36) return current + 4;
  if (current <= 60) return current + 12;

  return MAX_FONT_SIZE;
}

export function stepFontSize(editor: LexicalEditor, direction: 1 | -1): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const style = selection.style;
    const match = /font-size:\s*(\d+(?:\.\d+)?)px/.exec(style);
    const current = match ? Number(match[1]) : DEFAULT_FONT_SIZE;
    $patchStyleText(selection, { "font-size": `${nextFontSize(current, direction)}px` });
  });
}

// Opens the floating link editor directly in "editing" mode - matches clicking LinkControl.tsx's
// button, minus its own popover UI (FloatingLinkEditorPlugin already auto-edits a freshly-inserted
// link with no URL yet).
export function insertLinkPrompt(editor: LexicalEditor): void {
  editor.dispatchCommand(TOGGLE_LINK_COMMAND, "");
}
