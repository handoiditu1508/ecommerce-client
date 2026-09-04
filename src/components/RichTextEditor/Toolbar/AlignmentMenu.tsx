import SupportActionMenu, { SupportAction } from "@/components/SupportActionMenu";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ElementFormatType, FORMAT_ELEMENT_COMMAND, INDENT_CONTENT_COMMAND, LexicalEditor, OUTDENT_CONTENT_COMMAND } from "lexical";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { shortcutText } from "../shortcuts";
import { ALIGNMENTS } from "./formatOptions";

// A single dropdown bundling alignment + outdent/indent, matching the Lexical playground's
// alignment control - replaces the previous always-visible 4-icon ToggleButtonGroup.
function AlignmentMenu({ editor, alignment }: { editor: LexicalEditor; alignment: ElementFormatType; }) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);
  const currentIcon = ALIGNMENTS.find((option) => option.value === alignment)?.icon ?? ALIGNMENTS[0].icon;

  const items: SupportAction[] = [
    ...ALIGNMENTS.map(({ value, icon, label, shortcutName }, index): SupportAction => ({
      key: value,
      label: t(label),
      idleIcon: icon,
      secondaryText: shortcutName && shortcutText(shortcutName),
      bottomDivider: index === ALIGNMENTS.length - 1,
      actionHandler: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);
        close();
      },
    })),
    {
      key: "outdent",
      label: t("outdent"),
      idleIcon: <FormatIndentDecreaseIcon fontSize="small" />,
      secondaryText: shortcutText("OUTDENT"),
      actionHandler: () => {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        close();
      },
    },
    {
      key: "indent",
      label: t("indent"),
      idleIcon: <FormatIndentIncreaseIcon fontSize="small" />,
      secondaryText: shortcutText("INDENT"),
      actionHandler: () => {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        close();
      },
    },
  ];

  return (
    <>
      <Tooltip title={t("alignment")}>
        <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
          {currentIcon}
        </IconButton>
      </Tooltip>
      <SupportActionMenu items={items} anchorEl={anchor} open={Boolean(anchor)} onClose={close} />
    </>
  );
}

export default AlignmentMenu;
