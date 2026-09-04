import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import LinkIcon from "@mui/icons-material/Link";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { LexicalEditor } from "lexical";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { shortcutText } from "../shortcuts";

// Inserts a link on a plain selection only - editing/removing/opening an *existing* link is
// handled by the automatic FloatingLinkEditorPlugin bubble instead (see plugins/), so this button
// disables itself while the selection is already inside a link.
function LinkControl({ editor, isLink }: { editor: LexicalEditor; isLink: boolean; }) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState("");

  const applyLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null);
    setAnchor(null);
    setUrl("");
  };

  return (
    <>
      <Tooltip title={`${t("insert_link")} (${shortcutText("INSERT_LINK")})`}>
        <IconButton size="small" disabled={isLink} onClick={(event) => setAnchor(event.currentTarget)}>
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={() => setAnchor(null)}
      >
        <Stack direction="row" alignItems="center" gap={1} sx={{ p: 1.5 }}>
          <TextField
            size="small"
            autoFocus
            placeholder={t("link_url")}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
            }}
          />
          <Tooltip title={t("add")}>
            <IconButton size="small" color="primary" disabled={!url} onClick={applyLink}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Popover>
    </>
  );
}

export default LinkControl;
