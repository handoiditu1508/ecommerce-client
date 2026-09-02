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

export type ToolbarOption<V> = { value: V; icon: React.ReactNode; label: string; };

// Single source of truth for text-format tracking - Toolbar's `activeFormats` state and
// `clearFormatting` both need the complete list. PRIMARY_TEXT_FORMATS stays on the always-visible
// toolbar row; SECONDARY_TEXT_FORMATS moves behind the "More tools" popover, purely a layout split.
export const TEXT_FORMATS: ToolbarOption<TextFormatType>[] = [
  { value: "bold", icon: <FormatBoldIcon fontSize="small" />, label: "bold" },
  { value: "italic", icon: <FormatItalicIcon fontSize="small" />, label: "italic" },
  { value: "underline", icon: <FormatUnderlinedIcon fontSize="small" />, label: "underline" },
  { value: "strikethrough", icon: <FormatStrikethroughIcon fontSize="small" />, label: "strikethrough" },
  { value: "subscript", icon: <SubscriptIcon fontSize="small" />, label: "subscript" },
  { value: "superscript", icon: <SuperscriptIcon fontSize="small" />, label: "superscript" },
  { value: "code", icon: <CodeIcon fontSize="small" />, label: "inline_code" },
];

const PRIMARY_TEXT_FORMAT_VALUES: TextFormatType[] = ["bold", "italic", "underline"];
export const PRIMARY_TEXT_FORMATS = TEXT_FORMATS.filter((format) => PRIMARY_TEXT_FORMAT_VALUES.includes(format.value));
export const SECONDARY_TEXT_FORMATS = TEXT_FORMATS.filter(
  (format) => !PRIMARY_TEXT_FORMAT_VALUES.includes(format.value),
);

export const ALIGNMENTS: ToolbarOption<ElementFormatType>[] = [
  { value: "left", icon: <FormatAlignLeftIcon fontSize="small" />, label: "align_left" },
  { value: "center", icon: <FormatAlignCenterIcon fontSize="small" />, label: "align_center" },
  { value: "right", icon: <FormatAlignRightIcon fontSize="small" />, label: "align_right" },
  { value: "justify", icon: <FormatAlignJustifyIcon fontSize="small" />, label: "align_justify" },
];
