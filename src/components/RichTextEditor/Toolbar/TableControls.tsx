import SupportActionMenu, { SupportAction } from "@/components/SupportActionMenu";
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

  const rowItems: SupportAction[] = [
    { key: "above", label: t("insert_row_above"), actionHandler: () => insertRow(false) },
    { key: "below", label: t("insert_row_below"), actionHandler: () => insertRow(true) },
    { key: "delete", label: t("delete_row"), actionHandler: deleteRow },
  ];
  const columnItems: SupportAction[] = [
    { key: "left", label: t("insert_column_left"), actionHandler: () => insertColumn(false) },
    { key: "right", label: t("insert_column_right"), actionHandler: () => insertColumn(true) },
    { key: "delete", label: t("delete_column"), actionHandler: deleteColumn },
  ];

  return (
    <>
      <Divider orientation="vertical" flexItem />
      <Tooltip title={t("table_row")}>
        <IconButton size="small" onClick={(event) => setRowMenuAnchor(event.currentTarget)}>
          <TableRowsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <SupportActionMenu
        items={rowItems}
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={() => setRowMenuAnchor(null)}
      />

      <Tooltip title={t("table_column")}>
        <IconButton size="small" onClick={(event) => setColumnMenuAnchor(event.currentTarget)}>
          <ViewColumnIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <SupportActionMenu
        items={columnItems}
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={() => setColumnMenuAnchor(null)}
      />

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
