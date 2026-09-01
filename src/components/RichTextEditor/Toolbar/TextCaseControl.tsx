import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { $getSelection, $isRangeSelection, LexicalEditor } from "lexical";
import { useTranslation } from "react-i18next";

export type TextCase = "none" | "lowercase" | "uppercase" | "capitalize";

const CASE_FORMATS: Exclude<TextCase, "none">[] = ["lowercase", "uppercase", "capitalize"];

function TextCaseControl({ editor, textCase }: { editor: LexicalEditor; textCase: TextCase; }) {
  const { t } = useTranslation();

  const applyCase = (nextCase: TextCase) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // These formats are mutually exclusive - clear any other active case format before
      // applying the new one, so at most one is ever active at a time. `dispatchCommand` starts
      // its own update cycle, so it can't be called from inside this one - toggle the format
      // directly on the selection instead (what FORMAT_TEXT_COMMAND's own handler does).
      CASE_FORMATS.forEach((format) => {
        if (format !== nextCase && selection.hasFormat(format)) {
          selection.formatText(format);
        }
      });
      if (nextCase !== "none" && !selection.hasFormat(nextCase)) {
        selection.formatText(nextCase);
      }
    });
  };

  return (
    <FormControl size="small" variant="standard">
      <Select
        value={textCase}
        displayEmpty
        sx={{ minWidth: 90, fontSize: "0.875rem" }}
        onChange={(event) => applyCase(event.target.value as TextCase)}
      >
        <MenuItem value="none">{t("text_case_default")}</MenuItem>
        <MenuItem value="lowercase">{t("text_case_lowercase")}</MenuItem>
        <MenuItem value="uppercase">{t("text_case_uppercase")}</MenuItem>
        <MenuItem value="capitalize">{t("text_case_capitalize")}</MenuItem>
      </Select>
    </FormControl>
  );
}

export default TextCaseControl;
