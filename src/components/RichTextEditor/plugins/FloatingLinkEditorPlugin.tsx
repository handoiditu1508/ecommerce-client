import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { getLinkUrl, selectionHasAncestor } from "../lexicalSelectionUtils";

type Position = { top: number; left: number; };

// Appears automatically whenever the caret/selection is inside an existing link - editing an
// existing link no longer needs a toolbar click (see LinkControl.tsx, which now only *inserts*).
function FloatingLinkEditorPlugin({ anchorElem }: { anchorElem: HTMLElement | null; }) {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const popupRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setLinkUrl(null);

          return;
        }
        const anchorNode = selection.anchor.getNode();
        const url = selectionHasAncestor(anchorNode, $isLinkNode) ? getLinkUrl(anchorNode) : null;
        setLinkUrl(url);
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

  useEffect(() => {
    if (linkUrl === null) {
      setEditing(false);

      return;
    }
    setUrlDraft(linkUrl);
    // A link just inserted with no URL yet (see LinkControl.tsx) should open straight into edit
    // mode - there's nothing useful to show/open/remove until the user types something.
    if (linkUrl === "") setEditing(true);
  }, [linkUrl]);

  useLayoutEffect(() => {
    if (linkUrl === null || !anchorElem) {
      setPosition(null);

      return;
    }
    const popup = popupRef.current;
    const domSelection = window.getSelection();
    if (!popup || !domSelection || domSelection.rangeCount === 0) return;

    const rangeRect = domSelection.getRangeAt(0).getBoundingClientRect();
    const anchorRect = anchorElem.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const top = rangeRect.bottom - anchorRect.top + 8;
    const left = Math.max(4, Math.min(
      rangeRect.left - anchorRect.left,
      anchorRect.width - popupRect.width - 4,
    ));
    setPosition({ top, left });
  }, [linkUrl, editing, anchorElem]);

  if (linkUrl === null || !anchorElem) return null;

  const commit = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, urlDraft || null);
    setEditing(false);
  };

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
        p: 0.75,
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5}>
        {editing
          ? (
            <TextField
              size="small"
              variant="standard"
              autoFocus
              placeholder={t("link_url")}
              value={urlDraft}
              sx={{ minWidth: 200 }}
              onChange={(event) => setUrlDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commit();
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  setEditing(false);
                  setUrlDraft(linkUrl);
                }
              }}
            />
          )
          : (
            <Typography variant="body2" sx={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", px: 0.5 }}>
              {linkUrl}
            </Typography>
          )}
        {editing
          ? (
            <Tooltip title={t("add")}>
              <IconButton size="small" color="primary" onClick={commit}>
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
          : (
            <>
              <Tooltip title={t("open_link")}>
                <IconButton size="small" component="a" href={linkUrl} target="_blank" rel="noopener noreferrer">
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("edit")}>
                <IconButton size="small" onClick={() => setEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        <Tooltip title={t("remove")}>
          <IconButton size="small" onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}>
            <LinkOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>,
    anchorElem,
  );
}

export default FloatingLinkEditorPlugin;
