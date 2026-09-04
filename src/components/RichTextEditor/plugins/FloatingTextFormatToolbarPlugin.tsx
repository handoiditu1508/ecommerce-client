import { $isCodeNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import LinkIcon from "@mui/icons-material/Link";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TitleIcon from "@mui/icons-material/Title";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import Tooltip from "@mui/material/Tooltip";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
} from "lexical";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { selectionHasAncestor } from "../lexicalSelectionUtils";
import { shortcutText } from "../shortcuts";
import { CASE_FORMATS, TEXT_FORMATS, TextCase } from "../Toolbar/formatOptions";

type Position = { top: number; left: number; };

// Appears above a non-collapsed text selection, matching the Lexical playground's own floating
// toolbar - a curated subset of the primary toolbar's formatting controls, so a selection can be
// formatted without reaching up to the main toolbar row.
function FloatingTextFormatToolbarPlugin({ anchorElem }: { anchorElem: HTMLElement | null; }) {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const popupRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<TextFormatType[]>([]);
  const [textCase, setTextCase] = useState<TextCase>("none");
  const [isLink, setIsLink] = useState(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed() || selection.getTextContent().trim() === "") {
          setVisible(false);

          return;
        }

        const anchorNode = selection.anchor.getNode();
        if ($isCodeNode(anchorNode.getTopLevelElementOrThrow())) {
          setVisible(false);

          return;
        }

        setActiveFormats(TEXT_FORMATS.map((format) => format.value).filter((format) => selection.hasFormat(format)));
        setTextCase(
          selection.hasFormat("lowercase")
            ? "lowercase"
            : selection.hasFormat("uppercase")
              ? "uppercase"
              : selection.hasFormat("capitalize")
                ? "capitalize"
                : "none",
        );
        setIsLink(selectionHasAncestor(anchorNode, $isLinkNode));
        setVisible(true);
      });
    };

    return mergeRegister(
      editor.registerUpdateListener(update),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
        update();

        return false;
      }, COMMAND_PRIORITY_LOW),
    );
  }, [editor]);

  useLayoutEffect(() => {
    if (!visible || !anchorElem) {
      setPosition(null);

      return;
    }
    const popup = popupRef.current;
    const domSelection = window.getSelection();
    if (!popup || !domSelection || domSelection.rangeCount === 0) return;

    const rangeRect = domSelection.getRangeAt(0).getBoundingClientRect();
    const anchorRect = anchorElem.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const top = Math.max(4, rangeRect.top - anchorRect.top - popupRect.height - 8);
    const centeredLeft = (rangeRect.left - anchorRect.left) + (rangeRect.width / 2) - (popupRect.width / 2);
    const left = Math.max(4, Math.min(centeredLeft, anchorRect.width - popupRect.width - 4));
    setPosition({ top, left });
  }, [visible, activeFormats, textCase, isLink, anchorElem]);

  const applyCase = (nextCase: TextCase) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      CASE_FORMATS.forEach((format) => {
        if (format !== nextCase && selection.hasFormat(format)) selection.formatText(format);
      });
      if (nextCase !== "none" && !selection.hasFormat(nextCase)) selection.formatText(nextCase);
    });
  };

  if (!visible || !anchorElem) return null;

  return createPortal(
    <Paper
      ref={popupRef}
      elevation={3}
      sx={{
        position: "absolute",
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        zIndex: 2,
        opacity: position ? 1 : 0,
        display: "flex",
        alignItems: "center",
        p: 0.25,
      }}
    >
      {/* Each format is its own button, not grouped in a ToggleButtonGroup - matches the Lexical
          playground's own floating toolbar, where every item is an independent button. */}
      {TEXT_FORMATS.map(({ value, icon, label, shortcutName }) => (
        <Tooltip key={value} title={shortcutName ? `${t(label)} (${shortcutText(shortcutName)})` : t(label)}>
          <ToggleButton
            size="small"
            value={value}
            selected={activeFormats.includes(value)}
            aria-label={t(label)}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, value)}
          >
            {icon}
          </ToggleButton>
        </Tooltip>
      ))}
      <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
      <Tooltip title={`${t("text_case_lowercase")} (${shortcutText("LOWERCASE")})`}>
        <ToggleButton
          size="small"
          value="lowercase"
          selected={textCase === "lowercase"}
          aria-label={t("text_case_lowercase")}
          onClick={() => applyCase(textCase === "lowercase" ? "none" : "lowercase")}
        >
          <TextDecreaseIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={`${t("text_case_uppercase")} (${shortcutText("UPPERCASE")})`}>
        <ToggleButton
          size="small"
          value="uppercase"
          selected={textCase === "uppercase"}
          aria-label={t("text_case_uppercase")}
          onClick={() => applyCase(textCase === "uppercase" ? "none" : "uppercase")}
        >
          <TextIncreaseIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={`${t("text_case_capitalize")} (${shortcutText("CAPITALIZE")})`}>
        <ToggleButton
          size="small"
          value="capitalize"
          selected={textCase === "capitalize"}
          aria-label={t("text_case_capitalize")}
          onClick={() => applyCase(textCase === "capitalize" ? "none" : "capitalize")}
        >
          <TitleIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
      <Tooltip title={`${t("insert_link")} (${shortcutText("INSERT_LINK")})`}>
        <IconButton
          size="small"
          color={isLink ? "primary" : "default"}
          onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, isLink ? null : "")}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>,
    anchorElem,
  );
}

export default FloatingTextFormatToolbarPlugin;
