import SupportActionMenu, { SupportAction } from "@/components/SupportActionMenu";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import { mdiFormatLetterCase, mdiFormatLetterCaseLower, mdiFormatLetterCaseUpper } from "@mdi/js";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LexicalEditor, TextFormatType } from "lexical";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { applyTextCase } from "../richTextActions";
import { shortcutText } from "../shortcuts";
import { SECONDARY_TEXT_FORMATS, TextCase } from "./formatOptions";

// Everything not common enough for the primary toolbar row - mirrors the Lexical playground's own
// "More options" overflow: the mutually-exclusive text-case formats, the remaining text formats,
// and clear-formatting.
function MoreOptionsMenu({
  editor,
  activeFormats,
  onToggleFormats,
  textCase,
  onClearFormatting,
}: {
  editor: LexicalEditor;
  activeFormats: TextFormatType[];
  onToggleFormats: (formats: TextFormatType[]) => void;
  textCase: TextCase;
  onClearFormatting: () => void;
}) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);

  const applyCase = (nextCase: TextCase) => {
    applyTextCase(editor, nextCase);
    close();
  };

  const toggleFormatAction = (
    { value, icon, label, shortcutName }: typeof SECONDARY_TEXT_FORMATS[number],
  ): SupportAction => ({
    key: value,
    label: t(label),
    idleIcon: icon,
    secondaryText: shortcutName && shortcutText(shortcutName),
    actionHandler: () => {
      onToggleFormats(
        activeFormats.includes(value)
          ? activeFormats.filter((format) => format !== value)
          : [...activeFormats, value],
      );
      close();
    },
  });

  // Strikethrough sits below the mutually-exclusive case options rather than beside
  // subscript/superscript - purely a menu-ordering choice, not a functional grouping.
  const strikethroughFormat = SECONDARY_TEXT_FORMATS.find(({ value }) => value === "strikethrough");
  const otherFormats = SECONDARY_TEXT_FORMATS.filter(({ value }) => value !== "strikethrough");

  const items: SupportAction[] = [
    ...otherFormats.map(toggleFormatAction),
    {
      key: "lowercase",
      label: t("text_case_lowercase"),
      idleIcon: <MdiSvgIcon path={mdiFormatLetterCaseLower} fontSize="small" />,
      secondaryText: shortcutText("LOWERCASE"),
      actionHandler: () => applyCase("lowercase"),
    },
    {
      key: "uppercase",
      label: t("text_case_uppercase"),
      idleIcon: <MdiSvgIcon path={mdiFormatLetterCaseUpper} fontSize="small" />,
      secondaryText: shortcutText("UPPERCASE"),
      actionHandler: () => applyCase("uppercase"),
    },
    {
      key: "capitalize",
      label: t("text_case_capitalize"),
      idleIcon: <MdiSvgIcon path={mdiFormatLetterCase} fontSize="small" />,
      secondaryText: shortcutText("CAPITALIZE"),
      actionHandler: () => applyCase("capitalize"),
    },
    ...(strikethroughFormat ? [{ ...toggleFormatAction(strikethroughFormat), bottomDivider: true }] : []),
    {
      key: "clear",
      label: t("clear_formatting"),
      idleIcon: <FormatClearIcon fontSize="small" />,
      secondaryText: shortcutText("CLEAR_FORMATTING"),
      actionHandler: () => {
        onClearFormatting(); close();
      },
    },
  ];

  return (
    <>
      <Tooltip title={t("more_tools")}>
        <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <SupportActionMenu items={items} anchorEl={anchor} open={Boolean(anchor)} onClose={close} />
    </>
  );
}

export default MoreOptionsMenu;
