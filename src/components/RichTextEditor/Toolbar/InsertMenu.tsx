import SupportActionMenu, { SupportAction } from "@/components/SupportActionMenu";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import TableChartIcon from "@mui/icons-material/TableChart";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { LexicalEditor } from "lexical";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { insertEmbed } from "../plugins/EmbedPlugin";
import { ImagePickerRenderProps, insertImage, insertImageFromUrl } from "../plugins/ImagesPlugin";
import { INSERT_COLLAPSIBLE_COMMAND } from "../plugins/CollapsiblePlugin";
import { INSERT_LAYOUT_COMMAND, LAYOUT_PRESETS } from "../plugins/LayoutPlugin";

// The fields-only content of the "insert table" popover, so `InsertMenu` can own the anchor/open
// state (the popover is triggered by a menu item, not its own button - see `InsertMenu` below).
function TableSizeFields({ onSubmit }: { onSubmit: (rows: string, columns: string) => void; }) {
  const { t } = useTranslation();
  const [rows, setRows] = useState("3");
  const [columns, setColumns] = useState("3");

  return (
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
      <Button
        size="small"
        variant="contained"
        onClick={() => onSubmit(
          String(Math.min(20, Math.max(1, Number(rows) || 1))),
          String(Math.min(20, Math.max(1, Number(columns) || 1))),
        )}
      >
        {t("add")}
      </Button>
    </Stack>
  );
}

// Same idea as `TableSizeFields`, for the "insert video" popover.
function EmbedUrlField({ onSubmit }: { onSubmit: (url: string) => boolean; }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!onSubmit(url)) setError(true);
  };

  return (
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
  );
}

// Same idea as `TableSizeFields`, for the "insert columns layout" popover - a plain preset list
// rather than a dropdown-then-separate-Insert-button (as the Lexical playground does it), since
// there's no free-text field to fill in first; picking an option inserts it immediately.
function LayoutOptionsList({ onSelect }: { onSelect: (template: string) => void; }) {
  const { t } = useTranslation();

  return (
    <MenuList dense sx={{ minWidth: 220 }}>
      {LAYOUT_PRESETS.map(({ labelKey, template }) => (
        <MenuItem key={template} onClick={() => onSelect(template)}>{t(labelKey)}</MenuItem>
      ))}
    </MenuList>
  );
}

type InsertPopover = "table" | "embed" | "library" | "layout" | null;

// Single "Insert" dropdown, matching the Lexical playground's Insert menu - replaces the previous
// split always-visible-image-button/"more tools" layout. "Table"/"Video"/"Insert from library"
// open their own popover, anchored to this same button, once the menu itself closes.
function InsertMenu({ editor, renderImagePicker }: {
  editor: LexicalEditor;
  renderImagePicker?: (props: ImagePickerRenderProps) => React.ReactNode;
}) {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hiddenImageInputRef = useRef<HTMLInputElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [popover, setPopover] = useState<InsertPopover>(null);
  const closeMenu = () => setMenuAnchor(null);
  const closePopover = () => setPopover(null);

  const items: SupportAction[] = [
    {
      key: "image",
      label: t("insert_image"),
      idleIcon: <ImageIcon fontSize="small" />,
      actionHandler: () => {
        closeMenu();
        hiddenImageInputRef.current?.click();
      },
    },
    ...(renderImagePicker
      ? [{
        key: "library",
        label: t("insert_from_library"),
        idleIcon: <PhotoLibraryIcon fontSize="small" />,
        actionHandler: () => {
          closeMenu();
          setPopover("library");
        },
      } satisfies SupportAction]
      : []),
    {
      key: "table",
      label: t("insert_table"),
      idleIcon: <TableChartIcon fontSize="small" />,
      actionHandler: () => {
        closeMenu();
        setPopover("table");
      },
    },
    {
      key: "embed",
      label: t("insert_video"),
      idleIcon: <VideoLibraryIcon fontSize="small" />,
      actionHandler: () => {
        closeMenu();
        setPopover("embed");
      },
    },
    {
      key: "hr",
      label: t("insert_horizontal_rule"),
      idleIcon: <HorizontalRuleIcon fontSize="small" />,
      actionHandler: () => {
        closeMenu();
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
      },
    },
    {
      key: "collapsible",
      label: t("insert_collapsible"),
      idleIcon: <UnfoldMoreIcon fontSize="small" />,
      actionHandler: () => {
        closeMenu();
        editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
      },
    },
    {
      key: "layout",
      label: t("insert_columns"),
      idleIcon: <ViewColumnIcon fontSize="small" />,
      actionHandler: () => {
        closeMenu();
        setPopover("layout");
      },
    },
  ];

  return (
    <>
      <Tooltip title={t("insert")}>
        <IconButton ref={buttonRef} size="small" onClick={(event) => setMenuAnchor(event.currentTarget)}>
          <AddCircleOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <SupportActionMenu items={items} anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} />
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
      <Popover
        open={popover === "table"}
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={closePopover}
      >
        <TableSizeFields
          onSubmit={(rows, columns) => {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns });
            closePopover();
          }}
        />
      </Popover>
      <Popover
        open={popover === "embed"}
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={closePopover}
      >
        <EmbedUrlField
          onSubmit={(url) => {
            const inserted = insertEmbed(editor, url);
            if (inserted) closePopover();

            return inserted;
          }}
        />
      </Popover>
      <Popover
        open={popover === "layout"}
        anchorEl={buttonRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={closePopover}
      >
        <LayoutOptionsList
          onSelect={(template) => {
            editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template);
            closePopover();
          }}
        />
      </Popover>
      {popover === "library" && renderImagePicker && renderImagePicker({
        open: true,
        onClose: closePopover,
        onSelect: (image) => {
          insertImageFromUrl(editor, image.src, image.altText ?? "");
          closePopover();
        },
      })}
    </>
  );
}

export default InsertMenu;
