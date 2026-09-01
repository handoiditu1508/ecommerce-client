import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalNode, TextFormatType } from "lexical";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { insertImage } from "./plugins/ImagesPlugin";

function selectionHasAncestor(node: LexicalNode, predicate: (node: LexicalNode) => boolean): boolean {
  let current: LexicalNode | null = node;
  while (current) {
    if (predicate(current)) return true;
    current = current.getParent();
  }

  return false;
}

function Toolbar() {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<TextFormatType[]>([]);
  const [isLink, setIsLink] = useState(false);
  const [linkPopoverAnchor, setLinkPopoverAnchor] = useState<HTMLElement | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const hiddenImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setActiveFormats([]);
        setIsLink(false);

        return;
      }

      setActiveFormats((["bold", "italic", "underline"] as TextFormatType[]).filter((format) => selection.hasFormat(format)));
      setIsLink(selectionHasAncestor(selection.anchor.getNode(), $isLinkNode));
    });
  }), [editor]);

  const toggleLinkPopover = (event: React.MouseEvent<HTMLElement>) => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);

      return;
    }
    setLinkUrl("");
    setLinkPopoverAnchor(event.currentTarget);
  };

  const applyLink = () => {
    if (linkUrl) editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    setLinkPopoverAnchor(null);
  };

  const handleImageInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    Array.from(event.currentTarget.files ?? []).forEach((file) => insertImage(editor, file));
    event.currentTarget.value = "";
  };

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} sx={{ p: 0.5, borderBottom: 1, borderColor: "divider" }}>
      <ToggleButtonGroup
        size="small"
        value={activeFormats}
        onChange={(_event, formats: TextFormatType[]) => {
          (["bold", "italic", "underline"] as TextFormatType[]).forEach((format) => {
            if (formats.includes(format) !== activeFormats.includes(format)) {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
            }
          });
        }}
      >
        <ToggleButton value="bold" aria-label={t("bold")}><FormatBoldIcon fontSize="small" /></ToggleButton>
        <ToggleButton value="italic" aria-label={t("italic")}><FormatItalicIcon fontSize="small" /></ToggleButton>
        <ToggleButton value="underline" aria-label={t("underline")}><FormatUnderlinedIcon fontSize="small" /></ToggleButton>
      </ToggleButtonGroup>
      <Divider orientation="vertical" flexItem />
      <IconButton
        size="small"
        aria-label={t("bulleted_list")}
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        <FormatListBulletedIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        aria-label={t("numbered_list")}
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        <FormatListNumberedIcon fontSize="small" />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <IconButton size="small" aria-label={t("insert_link")} color={isLink ? "primary" : "default"} onClick={toggleLinkPopover}>
        <LinkIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label={t("insert_image")} onClick={() => hiddenImageInputRef.current?.click()}>
        <ImageIcon fontSize="small" />
      </IconButton>
      <input
        ref={hiddenImageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageInputChange}
      />
      <Popover
        open={Boolean(linkPopoverAnchor)}
        anchorEl={linkPopoverAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setLinkPopoverAnchor(null)}
      >
        <Stack direction="row" gap={1} sx={{ p: 1.5 }}>
          <TextField
            size="small"
            autoFocus
            placeholder={t("link_url")}
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
            }}
          />
          <Button size="small" variant="contained" onClick={applyLink}>{t("add")}</Button>
        </Stack>
      </Popover>
    </Stack>
  );
}

export default Toolbar;
