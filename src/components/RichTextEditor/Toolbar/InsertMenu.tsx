import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import TableChartIcon from "@mui/icons-material/TableChart";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { LexicalEditor } from "lexical";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { insertEmbed } from "../plugins/EmbedPlugin";
import { ImagePickerRenderProps, insertImage, insertImageFromUrl } from "../plugins/ImagesPlugin";

function TablePopoverButton({ editor }: { editor: LexicalEditor; }) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [rows, setRows] = useState("3");
  const [columns, setColumns] = useState("3");

  const insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: String(Math.min(20, Math.max(1, Number(rows) || 1))),
      columns: String(Math.min(20, Math.max(1, Number(columns) || 1))),
    });
    setAnchor(null);
  };

  return (
    <>
      <Tooltip title={t("insert_table")}>
        <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
          <TableChartIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover open={Boolean(anchor)} anchorEl={anchor} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} onClose={() => setAnchor(null)}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ p: 1.5 }}>
          <TextField
            size="small"
            type="number"
            label={t("columns")}
            value={columns}
            slotProps={{ htmlInput: { min: 1, max: 20 } }}
            sx={{ width: 90 }}
            onChange={(event) => setColumns(event.target.value)}
          />
          <TextField
            size="small"
            type="number"
            label={t("rows")}
            value={rows}
            slotProps={{ htmlInput: { min: 1, max: 20 } }}
            sx={{ width: 90 }}
            onChange={(event) => setRows(event.target.value)}
          />
          <Button size="small" variant="contained" onClick={insertTable}>{t("add")}</Button>
        </Stack>
      </Popover>
    </>
  );
}

function EmbedPopoverButton({ editor }: { editor: LexicalEditor; }) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (insertEmbed(editor, url)) {
      setAnchor(null);
      setUrl("");
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <Tooltip title={t("insert_video")}>
        <IconButton size="small" onClick={(event) => setAnchor(event.currentTarget)}>
          <VideoLibraryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover open={Boolean(anchor)} anchorEl={anchor} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} onClose={() => setAnchor(null)}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ p: 1.5 }}>
          <TextField
            size="small"
            autoFocus
            placeholder={t("youtube_or_vimeo_url")}
            value={url}
            error={error}
            helperText={error ? t("unsupported_video_url") : undefined}
            sx={{ width: 260 }}
            onChange={(event) => {
              setUrl(event.target.value); setError(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
          />
          <Button size="small" variant="contained" onClick={submit}>{t("add")}</Button>
        </Stack>
      </Popover>
    </>
  );
}

function ImageLibraryPickerButton({
  editor,
  renderImagePicker,
}: {
  editor: LexicalEditor;
  renderImagePicker: (props: ImagePickerRenderProps) => React.ReactNode;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={t("insert_from_library")}>
        <IconButton size="small" onClick={() => setOpen(true)}>
          <PhotoLibraryIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {renderImagePicker({
        open,
        onClose: () => setOpen(false),
        onSelect: (image) => {
          insertImageFromUrl(editor, image.src, image.altText ?? "");
          setOpen(false);
        },
      })}
    </>
  );
}

function InsertMenu({ editor, renderImagePicker }: {
  editor: LexicalEditor;
  renderImagePicker?: (props: ImagePickerRenderProps) => React.ReactNode;
}) {
  const { t } = useTranslation();
  const hiddenImageInputRef = useRef<HTMLInputElement>(null);

  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <Tooltip title={t("insert_image")}>
        <IconButton size="small" onClick={() => hiddenImageInputRef.current?.click()}>
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <input
        ref={hiddenImageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          Array.from(event.currentTarget.files ?? []).forEach((file) => insertImage(editor, file));
          event.currentTarget.value = "";
        }}
      />
      {renderImagePicker && <ImageLibraryPickerButton editor={editor} renderImagePicker={renderImagePicker} />}
      <TablePopoverButton editor={editor} />
      <EmbedPopoverButton editor={editor} />
      <Tooltip title={t("insert_horizontal_rule")}>
        <IconButton size="small" onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}>
          <HorizontalRuleIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default InsertMenu;
