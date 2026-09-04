export const IS_APPLE = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export type ShortcutBinding = {
  // KeyboardEvent.code (physical key, layout/shift-independent - event.key reports the *shifted*
  // character, e.g. Shift+7 produces "&" on a US layout, not "7", which would silently break
  // matching for every shifted-digit/symbol binding below).
  code: string;
  // Human-readable character for display only.
  label: string;
  ctrlOrMeta?: boolean;
  // A handful of playground bindings stay Ctrl even on macOS, instead of the usual Cmd swap.
  ctrlOnly?: boolean;
  shift?: boolean;
  alt?: boolean;
};

// Mirrors the Lexical playground's own SHORTCUT_BINDINGS (ShortcutsExtension/shortcuts.ts) - one
// binding per feature, used both to render human-readable shortcut text (tooltips, dropdown
// secondary text) and to actually match keydown events in ShortcutsPlugin.tsx.
export const SHORTCUT_BINDINGS = {
  NORMAL: { code: "Digit0", label: "0", ctrlOrMeta: true, alt: true },
  HEADING1: { code: "Digit1", label: "1", ctrlOrMeta: true, alt: true },
  HEADING2: { code: "Digit2", label: "2", ctrlOrMeta: true, alt: true },
  HEADING3: { code: "Digit3", label: "3", ctrlOrMeta: true, alt: true },
  NUMBERED_LIST: { code: "Digit7", label: "7", ctrlOrMeta: true, shift: true },
  BULLET_LIST: { code: "Digit8", label: "8", ctrlOrMeta: true, shift: true },
  CHECK_LIST: { code: "Digit9", label: "9", ctrlOrMeta: true, shift: true },
  CODE_BLOCK: { code: "KeyC", label: "C", ctrlOrMeta: true, alt: true },
  QUOTE: { code: "KeyQ", label: "Q", ctrlOnly: true, shift: true },

  INCREASE_FONT_SIZE: { code: "Period", label: ">", ctrlOrMeta: true, shift: true },
  DECREASE_FONT_SIZE: { code: "Comma", label: "<", ctrlOrMeta: true, shift: true },
  INSERT_CODE_BLOCK: { code: "KeyC", label: "C", ctrlOrMeta: true, shift: true },
  STRIKETHROUGH: { code: "KeyX", label: "X", ctrlOrMeta: true, shift: true },
  LOWERCASE: { code: "Digit1", label: "1", ctrlOnly: true, shift: true },
  UPPERCASE: { code: "Digit2", label: "2", ctrlOnly: true, shift: true },
  CAPITALIZE: { code: "Digit3", label: "3", ctrlOnly: true, shift: true },
  CENTER_ALIGN: { code: "KeyE", label: "E", ctrlOrMeta: true, shift: true },
  JUSTIFY_ALIGN: { code: "KeyJ", label: "J", ctrlOrMeta: true, shift: true },
  LEFT_ALIGN: { code: "KeyL", label: "L", ctrlOrMeta: true, shift: true },
  RIGHT_ALIGN: { code: "KeyR", label: "R", ctrlOrMeta: true, shift: true },

  SUBSCRIPT: { code: "Comma", label: ",", ctrlOrMeta: true },
  SUPERSCRIPT: { code: "Period", label: ".", ctrlOrMeta: true },
  INDENT: { code: "BracketRight", label: "]", ctrlOrMeta: true },
  OUTDENT: { code: "BracketLeft", label: "[", ctrlOrMeta: true },
  CLEAR_FORMATTING: { code: "Backslash", label: "\\", ctrlOrMeta: true },
  INSERT_LINK: { code: "KeyK", label: "K", ctrlOrMeta: true },

  BOLD: { code: "KeyB", label: "B", ctrlOrMeta: true },
  ITALIC: { code: "KeyI", label: "I", ctrlOrMeta: true },
  UNDERLINE: { code: "KeyU", label: "U", ctrlOrMeta: true },
  UNDO: { code: "KeyZ", label: "Z", ctrlOrMeta: true },
  REDO: { code: "KeyZ", label: "Z", ctrlOrMeta: true, shift: true },
} as const satisfies Record<string, ShortcutBinding>;

export type ShortcutName = keyof typeof SHORTCUT_BINDINGS;

// Lexical's core keydown handling (not our own ShortcutsPlugin) already matches plain Ctrl+Y for
// redo as a Windows/Linux-only alternate to Ctrl+Shift+Z - no binding/matching needed here, just
// surfacing it in the tooltip since SHORTCUT_BINDINGS.REDO alone doesn't mention it.
export function redoShortcutText(): string {
  return IS_APPLE ? shortcutText("REDO") : `${shortcutText("REDO")} / Ctrl+Y`;
}

// Human-readable shortcut text for tooltips/dropdown secondary text, e.g. "⌘⌥1" on macOS or
// "Ctrl+Alt+1" elsewhere.
export function shortcutText(name: ShortcutName): string {
  const binding: ShortcutBinding = SHORTCUT_BINDINGS[name];
  const usesMeta = IS_APPLE && binding.ctrlOrMeta && !binding.ctrlOnly;
  const parts: string[] = [];
  if (binding.ctrlOrMeta || binding.ctrlOnly) parts.push(usesMeta ? "⌘" : "Ctrl");
  if (binding.alt) parts.push(IS_APPLE ? "⌥" : "Alt");
  if (binding.shift) parts.push(IS_APPLE ? "⇧" : "Shift");
  parts.push(binding.label);

  return IS_APPLE ? parts.join("") : parts.join("+");
}

export function matchesShortcut(event: KeyboardEvent, name: ShortcutName): boolean {
  const binding: ShortcutBinding = SHORTCUT_BINDINGS[name];
  const usesMeta = IS_APPLE && binding.ctrlOrMeta && !binding.ctrlOnly;
  const ctrlOk = binding.ctrlOnly
    ? event.ctrlKey && !event.metaKey
    : binding.ctrlOrMeta
      ? (usesMeta ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey)
      : !event.ctrlKey && !event.metaKey;

  return ctrlOk
    && event.code === binding.code
    && event.shiftKey === !!binding.shift
    && event.altKey === !!binding.alt;
}
