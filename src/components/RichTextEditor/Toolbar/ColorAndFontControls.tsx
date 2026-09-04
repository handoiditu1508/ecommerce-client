import { $patchStyleText } from "@lexical/selection";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import FontSizeInput from "./FontSizeInput";

const FONT_FAMILIES: { label: string; value: string; }[] = [
  { label: "font_default", value: "" },
  { label: "font_arial", value: "Arial, sans-serif" },
  { label: "font_georgia", value: "Georgia, serif" },
  { label: "font_times_new_roman", value: "'Times New Roman', serif" },
  { label: "font_courier_new", value: "'Courier New', monospace" },
  { label: "font_verdana", value: "Verdana, sans-serif" },
];

function applyStyle(editor: LexicalEditor, property: string, value: string) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) $patchStyleText(selection, { [property]: value || null });
  });
}

function ColorPopoverButton({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  onChange: (color: string) => void;
}) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={label}>
        <IconButton size="small" aria-label={label} onClick={(event) => setAnchor(event.currentTarget)}>
          {icon}
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setAnchor(null)}
      >
        <Stack gap={1} sx={{ p: 1.5 }}>
          <HexColorPicker color={value || "#000000"} onChange={onChange} />
          <Button
            size="small"
            onClick={() => {
              onChange(""); setAnchor(null);
            }}>{t("clear")}
          </Button>
        </Stack>
      </Popover>
    </>
  );
}

function ColorAndFontControls({ editor, color, backgroundColor, fontFamily, fontSize }: {
  editor: LexicalEditor;
  color: string | null;
  backgroundColor: string | null;
  fontFamily: string | null;
  fontSize: string | null;
}) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <ColorPopoverButton
        icon={<FormatColorTextIcon fontSize="small" htmlColor={color || undefined} />}
        label={t("text_color")}
        value={color}
        onChange={(value) => applyStyle(editor, "color", value)}
      />
      <ColorPopoverButton
        icon={<FormatColorFillIcon fontSize="small" htmlColor={backgroundColor || undefined} />}
        label={t("highlight_color")}
        value={backgroundColor}
        onChange={(value) => applyStyle(editor, "background-color", value)}
      />
      <Tooltip title={t("font_family")}>
        <FormControl size="small" variant="standard">
          <Select
            value={fontFamily ?? ""}
            displayEmpty
            sx={{ minWidth: 110, fontSize: "0.875rem" }}
            onChange={(event) => applyStyle(editor, "font-family", event.target.value)}
          >
            {FONT_FAMILIES.map((font) => (
              <MenuItem key={font.value} value={font.value} sx={{ fontFamily: font.value || undefined }}>
                {t(font.label)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Tooltip>
      <FontSizeInput value={fontSize} onChange={(value) => applyStyle(editor, "font-size", value)} />
    </Stack>
  );
}

export default ColorAndFontControls;
