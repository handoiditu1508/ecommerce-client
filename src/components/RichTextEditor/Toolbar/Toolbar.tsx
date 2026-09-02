import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $isLinkNode } from "@lexical/link";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from "@lexical/rich-text";
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from "@lexical/selection";
import { $getTableCellNodeFromLexicalNode, $isTableSelection } from "@lexical/table";
import { $getNearestNodeOfType } from "@lexical/utils";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  TextFormatType,
} from "lexical";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePickerRenderProps } from "../plugins/ImagesPlugin";
import { PRIMARY_TEXT_FORMATS, SECONDARY_TEXT_FORMATS, TEXT_FORMATS } from "./formatOptions";
import { InsertImageButton } from "./InsertMenu";
import LinkControl from "./LinkControl";
import MoreToolsPopover from "./MoreToolsPopover";
import TableControls from "./TableControls";
import { TextCase } from "./TextCaseControl";

type BlockType = "paragraph" | HeadingTagType | "quote" | "code";

function selectionHasAncestor(node: LexicalNode, predicate: (node: LexicalNode) => boolean): boolean {
  let current: LexicalNode | null = node;
  while (current) {
    if (predicate(current)) return true;
    current = current.getParent();
  }

  return false;
}

function getLinkUrl(node: LexicalNode): string | null {
  let current: LexicalNode | null = node;
  while (current) {
    if ($isLinkNode(current)) return current.getURL();
    current = current.getParent();
  }

  return null;
}

function getBlockType(node: LexicalNode): BlockType {
  const element = node.getKey() === "root" ? node : node.getTopLevelElementOrThrow();
  if ($isHeadingNode(element)) return element.getTag();
  if ($isQuoteNode(element)) return "quote";
  if ($isCodeNode(element)) return "code";

  return "paragraph";
}

function Toolbar({ renderImagePicker }: { renderImagePicker?: (props: ImagePickerRenderProps) => React.ReactNode; }) {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<TextFormatType[]>([]);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [listType, setListType] = useState<"bullet" | "number" | "check" | null>(null);
  const [alignment, setAlignment] = useState<ElementFormatType>("left");
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [fontFamily, setFontFamily] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<string | null>(null);
  const [textCase, setTextCase] = useState<TextCase>("none");
  const [insideTable, setInsideTable] = useState(false);
  const [canMergeCells, setCanMergeCells] = useState(false);
  const [canUnmergeCell, setCanUnmergeCell] = useState(false);

  useEffect(() => editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const selection = $getSelection();

      if ($isTableSelection(selection)) {
        setCanMergeCells(selection.getNodes().length > 1);
        setInsideTable(true);
        setCanUnmergeCell(false);

        return;
      }
      setCanMergeCells(false);

      if (!$isRangeSelection(selection)) {
        setActiveFormats([]);
        setIsLink(false);
        setInsideTable(false);
        setCanUnmergeCell(false);

        return;
      }

      const anchorNode = selection.anchor.getNode();

      setActiveFormats((TEXT_FORMATS.map((f) => f.value)).filter((format) => selection.hasFormat(format)));
      setBlockType(getBlockType(anchorNode));
      const listNode = $getNearestNodeOfType(anchorNode, ListNode);
      setListType(listNode ? listNode.getListType() : null);
      setAlignment((anchorNode.getTopLevelElementOrThrow().getFormatType() || "left") as ElementFormatType);
      setIsLink(selectionHasAncestor(anchorNode, $isLinkNode));
      setLinkUrl(getLinkUrl(anchorNode));
      setColor($getSelectionStyleValueForProperty(selection, "color", "") || null);
      setBackgroundColor($getSelectionStyleValueForProperty(selection, "background-color", "") || null);
      setFontFamily($getSelectionStyleValueForProperty(selection, "font-family", "") || null);
      setFontSize($getSelectionStyleValueForProperty(selection, "font-size", "") || null);
      setTextCase(
        selection.hasFormat("lowercase")
          ? "lowercase"
          : selection.hasFormat("uppercase")
            ? "uppercase"
            : selection.hasFormat("capitalize")
              ? "capitalize"
              : "none",
      );

      const cellNode = $getTableCellNodeFromLexicalNode(anchorNode);
      setInsideTable(!!cellNode);
      setCanUnmergeCell(!!cellNode && (cellNode.getColSpan() > 1 || cellNode.getRowSpan() > 1));
    });
  }), [editor]);

  const setBlockTypeTo = (nextBlockType: BlockType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (nextBlockType === "paragraph") $setBlocksType(selection, () => $createParagraphNode());
      else if (nextBlockType === "quote") $setBlocksType(selection, () => $createQuoteNode());
      else if (nextBlockType === "code") $setBlocksType(selection, () => $createCodeNode());
      else $setBlocksType(selection, () => $createHeadingNode(nextBlockType));
    });
  };

  const toggleList = (type: "bullet" | "number" | "check") => {
    if (listType === type) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);

      return;
    }
    const command = type === "bullet" ? INSERT_UNORDERED_LIST_COMMAND : type === "number" ? INSERT_ORDERED_LIST_COMMAND : INSERT_CHECK_LIST_COMMAND;
    editor.dispatchCommand(command, undefined);
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // `dispatchCommand` starts its own update cycle, so it can't be called from inside this
      // one - toggle each active format directly on the selection instead.
      TEXT_FORMATS.forEach(({ value }) => {
        if (selection.hasFormat(value)) selection.formatText(value);
      });
      $patchStyleText(selection, { color: null, "background-color": null, "font-family": null, "font-size": null });
    });
  };

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} sx={{ p: 0.5, borderBottom: 1, borderColor: "divider" }}>
      <FormControl size="small" variant="standard">
        <Select
          value={blockType}
          sx={{ minWidth: 130, fontSize: "0.875rem" }}
          onChange={(event) => setBlockTypeTo(event.target.value as BlockType)}
        >
          <MenuItem value="paragraph">{t("paragraph")}</MenuItem>
          <MenuItem value="h1">{t("heading_n", "", { level: 1 })}</MenuItem>
          <MenuItem value="h2">{t("heading_n", "", { level: 2 })}</MenuItem>
          <MenuItem value="h3">{t("heading_n", "", { level: 3 })}</MenuItem>
          <MenuItem value="h4">{t("heading_n", "", { level: 4 })}</MenuItem>
          <MenuItem value="h5">{t("heading_n", "", { level: 5 })}</MenuItem>
          <MenuItem value="h6">{t("heading_n", "", { level: 6 })}</MenuItem>
          <MenuItem value="quote"><FormatQuoteIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />{t("quote")}</MenuItem>
          <MenuItem value="code"><CodeIcon fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />{t("code_block")}</MenuItem>
        </Select>
      </FormControl>
      <Divider orientation="vertical" flexItem />
      <ToggleButtonGroup
        size="small"
        value={activeFormats}
        onChange={(_event, formats: TextFormatType[]) => {
          PRIMARY_TEXT_FORMATS.forEach(({ value }) => {
            if (formats.includes(value) !== activeFormats.includes(value)) {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
            }
          });
        }}
      >
        {PRIMARY_TEXT_FORMATS.map(({ value, icon, label }) => (
          <ToggleButton key={value} value={value} aria-label={t(label)}>{icon}</ToggleButton>
        ))}
      </ToggleButtonGroup>
      <Divider orientation="vertical" flexItem />
      <Tooltip title={t("bulleted_list")}>
        <IconButton size="small" color={listType === "bullet" ? "primary" : "default"} onClick={() => toggleList("bullet")}>
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t("numbered_list")}>
        <IconButton size="small" color={listType === "number" ? "primary" : "default"} onClick={() => toggleList("number")}>
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <LinkControl editor={editor} isLink={isLink} linkUrl={linkUrl} />
      <Divider orientation="vertical" flexItem />
      <InsertImageButton editor={editor} />
      <Divider orientation="vertical" flexItem />
      <MoreToolsPopover
        editor={editor}
        activeFormats={activeFormats}
        color={color}
        backgroundColor={backgroundColor}
        fontFamily={fontFamily}
        fontSize={fontSize}
        textCase={textCase}
        alignment={alignment}
        checklistActive={listType === "check"}
        renderImagePicker={renderImagePicker}
        onToggleFormats={(formats) => {
          SECONDARY_TEXT_FORMATS.forEach(({ value }) => {
            if (formats.includes(value) !== activeFormats.includes(value)) {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
            }
          });
        }}
        onClearFormatting={clearFormatting}
        onToggleChecklist={() => toggleList("check")}
      />
      {insideTable && <TableControls editor={editor} canMergeCells={canMergeCells} canUnmergeCell={canUnmergeCell} />}
    </Stack>
  );
}

export default Toolbar;
