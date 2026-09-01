import {
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableCellNode,
  $isTableSelection,
  $mergeCells,
  $unmergeCell,
} from "@lexical/table";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { $getSelection, LexicalEditor } from "lexical";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function TableControls({ editor, canMergeCells, canUnmergeCell }: {
  editor: LexicalEditor;
  canMergeCells: boolean;
  canUnmergeCell: boolean;
}) {
  const { t } = useTranslation();
  const [rowMenuAnchor, setRowMenuAnchor] = useState<HTMLElement | null>(null);
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<HTMLElement | null>(null);

  const insertRow = (insertAfter: boolean) => {
    editor.update(() => $insertTableRowAtSelection(insertAfter));
    setRowMenuAnchor(null);
  };
  const deleteRow = () => {
    editor.update(() => $deleteTableRowAtSelection());
    setRowMenuAnchor(null);
  };
  const insertColumn = (insertAfter: boolean) => {
    editor.update(() => $insertTableColumnAtSelection(insertAfter));
    setColumnMenuAnchor(null);
  };
  const deleteColumn = () => {
    editor.update(() => $deleteTableColumnAtSelection());
    setColumnMenuAnchor(null);
  };
  const mergeCells = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isTableSelection(selection)) $mergeCells(selection.getNodes().filter($isTableCellNode));
    });
  };
  const unmergeCell = () => {
    editor.update(() => $unmergeCell());
  };

  return (
    <>
      <Divider orientation="vertical" flexItem />
      <Tooltip title={t("table_row")}>
        <IconButton size="small" onClick={(event) => setRowMenuAnchor(event.currentTarget)}>
          <TableRowsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu open={Boolean(rowMenuAnchor)} anchorEl={rowMenuAnchor} onClose={() => setRowMenuAnchor(null)}>
        <MenuItem onClick={() => insertRow(false)}>{t("insert_row_above")}</MenuItem>
        <MenuItem onClick={() => insertRow(true)}>{t("insert_row_below")}</MenuItem>
        <MenuItem onClick={deleteRow}>{t("delete_row")}</MenuItem>
      </Menu>

      <Tooltip title={t("table_column")}>
        <IconButton size="small" onClick={(event) => setColumnMenuAnchor(event.currentTarget)}>
          <ViewColumnIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu open={Boolean(columnMenuAnchor)} anchorEl={columnMenuAnchor} onClose={() => setColumnMenuAnchor(null)}>
        <MenuItem onClick={() => insertColumn(false)}>{t("insert_column_left")}</MenuItem>
        <MenuItem onClick={() => insertColumn(true)}>{t("insert_column_right")}</MenuItem>
        <MenuItem onClick={deleteColumn}>{t("delete_column")}</MenuItem>
      </Menu>

      <Tooltip title={t("merge_cells")}>
        <span>
          <IconButton size="small" disabled={!canMergeCells} onClick={mergeCells}>
            <CallMergeIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t("unmerge_cell")}>
        <span>
          <IconButton size="small" disabled={!canUnmergeCell} onClick={unmergeCell}>
            <CallSplitIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}

export default TableControls;
