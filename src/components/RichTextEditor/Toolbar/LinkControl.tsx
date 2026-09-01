import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { LexicalEditor } from "lexical";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LinkControl({ editor, isLink, linkUrl }: { editor: LexicalEditor; isLink: boolean; linkUrl: string | null; }) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (anchor) setUrl(linkUrl ?? "");
  }, [anchor, linkUrl]);

  const applyLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null);
    setAnchor(null);
  };

  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title={t("insert_link")}>
        <IconButton size="small" color={isLink ? "primary" : "default"} onClick={(event) => setAnchor(event.currentTarget)}>
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
          {isLink && (
            <>
              <Tooltip title={t("open_link")}>
                <span>
                  <IconButton size="small" component="a" href={linkUrl ?? undefined} target="_blank" rel="noopener noreferrer" disabled={!linkUrl}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={t("remove")}>
                <IconButton size="small" onClick={removeLink}>
                  <LinkOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Popover>
    </>
  );
}

export default LinkControl;
