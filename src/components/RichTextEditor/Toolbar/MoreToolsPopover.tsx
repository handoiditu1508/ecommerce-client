import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import { ElementFormatType, FORMAT_ELEMENT_COMMAND, INDENT_CONTENT_COMMAND, LexicalEditor, OUTDENT_CONTENT_COMMAND, TextFormatType } from "lexical";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePickerRenderProps } from "../plugins/ImagesPlugin";
import ColorAndFontControls from "./ColorAndFontControls";
import { ALIGNMENTS, SECONDARY_TEXT_FORMATS } from "./formatOptions";
import { InsertMoreTools } from "./InsertMenu";
import TextCaseControl, { TextCase } from "./TextCaseControl";

// Everything not common enough to earn a permanent spot on Toolbar's primary row - opened from a
// single "More tools" button so the always-visible toolbar stays short.
function MoreToolsPopover({
  editor,
  activeFormats,
  onToggleFormats,
  onClearFormatting,
  color,
  backgroundColor,
  fontFamily,
  fontSize,
  textCase,
  alignment,
  checklistActive,
  onToggleChecklist,
  renderImagePicker,
}: {
  editor: LexicalEditor;
  activeFormats: TextFormatType[];
  onToggleFormats: (formats: TextFormatType[]) => void;
  onClearFormatting: () => void;
  color: string | null;
  backgroundColor: string | null;
  fontFamily: string | null;
  fontSize: string | null;
  textCase: TextCase;
  alignment: ElementFormatType;
  checklistActive: boolean;
  onToggleChecklist: () => void;
  renderImagePicker?: (props: ImagePickerRenderProps) => React.ReactNode;
}) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={t("more_tools")}>
        <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setAnchor(null)}
      >
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} sx={{ p: 1, maxWidth: 360 }}>
          <ToggleButtonGroup
            size="small"
            value={activeFormats}
            onChange={(_event, formats: TextFormatType[]) => onToggleFormats(formats)}
          >
            {SECONDARY_TEXT_FORMATS.map(({ value, icon, label }) => (
              <ToggleButton key={value} value={value} aria-label={t(label)}>{icon}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Tooltip title={t("clear_formatting")}>
            <IconButton size="small" onClick={onClearFormatting}><FormatClearIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <ColorAndFontControls
            editor={editor}
            color={color}
            backgroundColor={backgroundColor}
            fontFamily={fontFamily}
            fontSize={fontSize}
          />
          <TextCaseControl editor={editor} textCase={textCase} />
          <Divider orientation="vertical" flexItem />
          <ToggleButtonGroup
            size="small"
            exclusive
            value={alignment}
            onChange={(_event, value: ElementFormatType | null) => {
              if (value) editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);
            }}
          >
            {ALIGNMENTS.map(({ value, icon, label }) => (
              <ToggleButton key={value} value={value} aria-label={t(label)}>{icon}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Tooltip title={t("outdent")}>
            <IconButton size="small" onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}>
              <FormatIndentDecreaseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("indent")}>
            <IconButton size="small" onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}>
              <FormatIndentIncreaseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <Tooltip title={t("checklist")}>
            <IconButton size="small" color={checklistActive ? "primary" : "default"} onClick={onToggleChecklist}>
              <CheckBoxIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem />
          <InsertMoreTools editor={editor} renderImagePicker={renderImagePicker} />
        </Stack>
      </Popover>
    </>
  );
}

export default MoreToolsPopover;
