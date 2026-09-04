import CodeIcon from "@mui/icons-material/Code";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import SubscriptIcon from "@mui/icons-material/Subscript";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import { ElementFormatType, TextFormatType } from "lexical";
import { ShortcutName } from "../shortcuts";

export type ToolbarOption<V> = { value: V; icon: React.ReactNode; label: string; shortcutName?: ShortcutName; };

// Single source of truth for text-format tracking - Toolbar's `activeFormats` state and
// `clearFormatting` both need the complete list. PRIMARY_TEXT_FORMATS stays on the always-visible
// toolbar row (matches the Lexical playground's own primary row: bold/italic/underline/inline
// code, each its own button - not grouped); SECONDARY_TEXT_FORMATS moves into the "More options"
// menu, purely a layout split.
export const TEXT_FORMATS: ToolbarOption<TextFormatType>[] = [
  { value: "bold", icon: <FormatBoldIcon fontSize="small" />, label: "bold", shortcutName: "BOLD" },
  { value: "italic", icon: <FormatItalicIcon fontSize="small" />, label: "italic", shortcutName: "ITALIC" },
  { value: "underline", icon: <FormatUnderlinedIcon fontSize="small" />, label: "underline", shortcutName: "UNDERLINE" },
  { value: "code", icon: <CodeIcon fontSize="small" />, label: "inline_code", shortcutName: "INSERT_CODE_BLOCK" },
  { value: "strikethrough", icon: <FormatStrikethroughIcon fontSize="small" />, label: "strikethrough", shortcutName: "STRIKETHROUGH" },
  { value: "subscript", icon: <SubscriptIcon fontSize="small" />, label: "subscript", shortcutName: "SUBSCRIPT" },
  { value: "superscript", icon: <SuperscriptIcon fontSize="small" />, label: "superscript", shortcutName: "SUPERSCRIPT" },
];

const PRIMARY_TEXT_FORMAT_VALUES: TextFormatType[] = ["bold", "italic", "underline", "code"];
export const PRIMARY_TEXT_FORMATS = TEXT_FORMATS.filter((format) => PRIMARY_TEXT_FORMAT_VALUES.includes(format.value));
export const SECONDARY_TEXT_FORMATS = TEXT_FORMATS.filter(
  (format) => !PRIMARY_TEXT_FORMAT_VALUES.includes(format.value),
);

export const ALIGNMENTS: ToolbarOption<ElementFormatType>[] = [
  { value: "left", icon: <FormatAlignLeftIcon fontSize="small" />, label: "align_left", shortcutName: "LEFT_ALIGN" },
  { value: "center", icon: <FormatAlignCenterIcon fontSize="small" />, label: "align_center", shortcutName: "CENTER_ALIGN" },
  { value: "right", icon: <FormatAlignRightIcon fontSize="small" />, label: "align_right", shortcutName: "RIGHT_ALIGN" },
  { value: "justify", icon: <FormatAlignJustifyIcon fontSize="small" />, label: "align_justify", shortcutName: "JUSTIFY_ALIGN" },
];

// Mutually exclusive text-format subset (Lexical's built-in `TextFormatType`s, not a style) -
// applying one clears any other before setting itself. Lives here so both `Toolbar.tsx` (state
// tracking) and `MoreOptionsMenu.tsx` (the menu items) share one definition.
export type TextCase = "none" | "lowercase" | "uppercase" | "capitalize";
export const CASE_FORMATS: Exclude<TextCase, "none">[] = ["lowercase", "uppercase", "capitalize"];
