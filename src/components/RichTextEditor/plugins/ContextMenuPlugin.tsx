import SupportActionMenu, { SupportAction } from "@/components/SupportActionMenu";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import LinkIcon from "@mui/icons-material/Link";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, TextFormatType } from "lexical";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { clearFormatting, insertLinkPrompt } from "../richTextActions";
import { shortcutText } from "../shortcuts";
import { PRIMARY_TEXT_FORMATS } from "../Toolbar/formatOptions";

// Right-click menu, scoped to feasible actions - not a full copy/cut/paste override (unreliable
// across browsers' clipboard permission models, and native context menus already offer those).
function ContextMenuPlugin() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number; } | null>(null);

  useEffect(() => editor.registerRootListener((rootElement, prevRootElement) => {
    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      setAnchorPosition({ top: event.clientY, left: event.clientX });
    };
    prevRootElement?.removeEventListener("contextmenu", onContextMenu);
    rootElement?.addEventListener("contextmenu", onContextMenu);
  }), [editor]);

  const closeMenu = () => setAnchorPosition(null);

  const toggleFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    closeMenu();
  };

  const insertLink = () => {
    insertLinkPrompt(editor);
    closeMenu();
  };

  const deleteBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      selection.anchor.getNode().getTopLevelElementOrThrow()
        .remove();
    });
    closeMenu();
  };

  const items: SupportAction[] = [
    ...PRIMARY_TEXT_FORMATS.map(({ value, icon, label, shortcutName }) => ({
      key: value,
      label: t(label),
      idleIcon: icon,
      secondaryText: shortcutName && shortcutText(shortcutName),
      actionHandler: () => toggleFormat(value),
    })),
    {
      key: "link",
      label: t("insert_link"),
      idleIcon: <LinkIcon fontSize="small" />,
      secondaryText: shortcutText("INSERT_LINK"),
      bottomDivider: true,
      actionHandler: insertLink,
    },
    {
      key: "clear",
      label: t("clear_formatting"),
      idleIcon: <FormatClearIcon fontSize="small" />,
      secondaryText: shortcutText("CLEAR_FORMATTING"),
      actionHandler: () => {
        clearFormatting(editor); closeMenu();
      },
    },
    { key: "delete", label: t("delete_block"), idleIcon: <DeleteOutlineIcon fontSize="small" />, actionHandler: deleteBlock },
  ];

  return (
    <SupportActionMenu
      items={items}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition ?? undefined}
      open={Boolean(anchorPosition)}
      onClose={closeMenu}
    />
  );
}

export default ContextMenuPlugin;
