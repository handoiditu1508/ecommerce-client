import MdiSvgIcon from "@/components/MdiSvgIcon";
import { $isCodeNode, CodeNode, DEFAULT_CODE_LANGUAGE, getCodeLanguageOptions, normalizeCodeLang } from "@lexical/code";
import { $isLinkNode } from "@lexical/link";
import { ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $getTableCellNodeFromLexicalNode, $isTableSelection } from "@lexical/table";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  mdiCodeBlockTags,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
} from "@mdi/js";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import NotesIcon from "@mui/icons-material/Notes";
import RedoIcon from "@mui/icons-material/Redo";
import SearchIcon from "@mui/icons-material/Search";
import UndoIcon from "@mui/icons-material/Undo";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  $getSelection,
  $isRangeSelection,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  LexicalNode,
  REDO_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
} from "lexical";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectionHasAncestor } from "../lexicalSelectionUtils";
import { TOGGLE_FIND_REPLACE_COMMAND } from "../plugins/FindReplacePlugin";
import { ImagePickerRenderProps } from "../plugins/ImagesPlugin";
import { clearFormatting, setBlockType } from "../richTextActions";
import { redoShortcutText, shortcutText } from "../shortcuts";
import AlignmentMenu from "./AlignmentMenu";
import { BlockSelectValue, BlockType, ListType } from "./blockTypes";
import ColorAndFontControls from "./ColorAndFontControls";
import { PRIMARY_TEXT_FORMATS, SECONDARY_TEXT_FORMATS, TEXT_FORMATS, TextCase } from "./formatOptions";
import InsertMenu from "./InsertMenu";
import LinkControl from "./LinkControl";
import MoreOptionsMenu from "./MoreOptionsMenu";
import TableControls from "./TableControls";

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

// A shortcut name from shortcuts.ts, where one exists for a given block type - h4/h5/h6 have no
// playground-defined shortcut, so they're simply omitted from the secondary text.
const BLOCK_SHORTCUTS: Partial<Record<BlockSelectValue, string>> = {
  paragraph: shortcutText("NORMAL"),
  h1: shortcutText("HEADING1"),
  h2: shortcutText("HEADING2"),
  h3: shortcutText("HEADING3"),
  quote: shortcutText("QUOTE"),
  code: shortcutText("CODE_BLOCK"),
  number: shortcutText("NUMBERED_LIST"),
  bullet: shortcutText("BULLET_LIST"),
  check: shortcutText("CHECK_LIST"),
};

// `Select` clones its direct `children` to wire up click/selected behavior, which only works for
// literal `MenuItem` elements - a custom wrapper component in that position (even one that itself
// renders a MenuItem) breaks that cloning and its props never reach the render. So `MenuItem` has
// to stay the direct child in the option list below; this is just the icon+label(+shortcut)
// row used *inside* one (for the list) or standalone (for the Select's own closed-state display,
// via `renderValue`, which needs a shortcut-free version - no room for it in the closed button).
function BlockOptionContent({ icon, label, shortcut }: { icon: React.ReactNode; label: string; shortcut?: string; }) {
  return (
    <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: 0, flexGrow: 1 }}>
      {icon}
      <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>{label}</Typography>
      {shortcut && <Typography variant="body2" color="text.secondary">{shortcut}</Typography>}
    </Stack>
  );
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
  const [blockType, setBlockTypeState] = useState<BlockType>("paragraph");
  const [codeLanguage, setCodeLanguage] = useState(normalizeCodeLang(DEFAULT_CODE_LANGUAGE));
  const [listType, setListType] = useState<ListType | null>(null);
  const [alignment, setAlignment] = useState<ElementFormatType>("left");
  const [isLink, setIsLink] = useState(false);
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
      setBlockTypeState(getBlockType(anchorNode));
      const codeNode = $getNearestNodeOfType(anchorNode, CodeNode);
      setCodeLanguage(normalizeCodeLang(codeNode?.getLanguage() || DEFAULT_CODE_LANGUAGE));
      const listNode = $getNearestNodeOfType(anchorNode, ListNode);
      setListType((listNode?.getListType() as ListType | undefined) ?? null);
      setAlignment((anchorNode.getTopLevelElementOrThrow().getFormatType() || "left") as ElementFormatType);
      setIsLink(selectionHasAncestor(anchorNode, $isLinkNode));
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

  // The select shows the list type while inside a list (lists and headings/paragraph/quote/code
  // are mutually exclusive block-level concepts, folded into one control matching the Lexical
  // playground's own block-type dropdown).
  const blockSelectValue: BlockSelectValue = listType ?? blockType;

  const blockTypeOptions: { value: BlockSelectValue; icon: React.ReactNode; label: string; }[] = [
    { value: "paragraph", icon: <NotesIcon fontSize="small" />, label: t("paragraph") },
    { value: "h1", icon: <MdiSvgIcon path={mdiFormatHeader1} fontSize="small" />, label: t("heading_n", "", { level: 1 }) },
    { value: "h2", icon: <MdiSvgIcon path={mdiFormatHeader2} fontSize="small" />, label: t("heading_n", "", { level: 2 }) },
    { value: "h3", icon: <MdiSvgIcon path={mdiFormatHeader3} fontSize="small" />, label: t("heading_n", "", { level: 3 }) },
    { value: "h4", icon: <MdiSvgIcon path={mdiFormatHeader4} fontSize="small" />, label: t("heading_n", "", { level: 4 }) },
    { value: "h5", icon: <MdiSvgIcon path={mdiFormatHeader5} fontSize="small" />, label: t("heading_n", "", { level: 5 }) },
    { value: "h6", icon: <MdiSvgIcon path={mdiFormatHeader6} fontSize="small" />, label: t("heading_n", "", { level: 6 }) },
    { value: "quote", icon: <FormatQuoteIcon fontSize="small" />, label: t("quote") },
    { value: "code", icon: <MdiSvgIcon path={mdiCodeBlockTags} fontSize="small" />, label: t("code_block") },
  ];
  const listTypeOptions: { value: BlockSelectValue; icon: React.ReactNode; label: string; }[] = [
    { value: "bullet", icon: <FormatListBulletedIcon fontSize="small" />, label: t("bulleted_list") },
    { value: "number", icon: <FormatListNumberedIcon fontSize="small" />, label: t("numbered_list") },
    { value: "check", icon: <ChecklistIcon fontSize="small" />, label: t("checklist") },
  ];
  const blockOptions = [...blockTypeOptions, ...listTypeOptions];

  const setCodeLanguageTo = (language: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const node = $getNearestNodeOfType(selection.anchor.getNode(), CodeNode);
      node?.setLanguage(language);
    });
  };

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5} sx={{ p: 0.5, borderBottom: 1, borderColor: "divider" }}>
      <Tooltip title={`${t("undo")} (${shortcutText("UNDO")})`}>
        <IconButton size="small" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={`${t("redo")} (${redoShortcutText()})`}>
        <IconButton size="small" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
          <RedoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <FormControl size="small" variant="standard">
        <Select
          value={blockSelectValue}
          sx={{ minWidth: 150, fontSize: "0.875rem" }}
          renderValue={(value) => {
            const option = blockOptions.find((candidate) => candidate.value === value);

            return option && <BlockOptionContent icon={option.icon} label={option.label} />;
          }}
          onChange={(event) => setBlockType(editor, event.target.value as BlockSelectValue)}
        >
          {blockTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <BlockOptionContent icon={option.icon} label={option.label} shortcut={BLOCK_SHORTCUTS[option.value]} />
            </MenuItem>
          ))}
          <Divider />
          {listTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <BlockOptionContent icon={option.icon} label={option.label} shortcut={BLOCK_SHORTCUTS[option.value]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {blockType === "code" && (
        <FormControl size="small" variant="standard">
          <Select
            value={codeLanguage}
            sx={{ minWidth: 130, fontSize: "0.875rem" }}
            onChange={(event) => setCodeLanguageTo(event.target.value)}
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, label]) => (
              <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Divider orientation="vertical" flexItem />
      <ColorAndFontControls
        editor={editor}
        color={color}
        backgroundColor={backgroundColor}
        fontFamily={fontFamily}
        fontSize={fontSize}
      />
      <Divider orientation="vertical" flexItem />
      {/* Bold/Italic/Underline/inline-Code are visually joined (no gaps/rounding between them),
          but with the group's own dividing border stripped so they read like every other
          standalone toolbar button instead of a boxed-in control. */}
      <ToggleButtonGroup size="small" sx={{ "& .MuiToggleButtonGroup-grouped": { border: 0 } }}>
        {PRIMARY_TEXT_FORMATS.map(({ value, icon, label, shortcutName }) => (
          <Tooltip key={value} title={shortcutName ? `${t(label)} (${shortcutText(shortcutName)})` : t(label)}>
            <ToggleButton
              value={value}
              selected={activeFormats.includes(value)}
              aria-label={t(label)}
              onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, value)}
            >
              {icon}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>
      <Divider orientation="vertical" flexItem />
      <LinkControl editor={editor} isLink={isLink} />
      <Divider orientation="vertical" flexItem />
      <MoreOptionsMenu
        editor={editor}
        activeFormats={activeFormats}
        textCase={textCase}
        onToggleFormats={(formats) => {
          SECONDARY_TEXT_FORMATS.forEach(({ value }) => {
            if (formats.includes(value) !== activeFormats.includes(value)) {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
            }
          });
        }}
        onClearFormatting={() => clearFormatting(editor)}
      />
      <Divider orientation="vertical" flexItem />
      <InsertMenu editor={editor} renderImagePicker={renderImagePicker} />
      <Divider orientation="vertical" flexItem />
      <AlignmentMenu editor={editor} alignment={alignment} />
      {insideTable && <TableControls editor={editor} canMergeCells={canMergeCells} canUnmergeCell={canUnmergeCell} />}
      <Divider orientation="vertical" flexItem />
      <Tooltip title={t("find_and_replace")}>
        <IconButton size="small" onClick={() => editor.dispatchCommand(TOGGLE_FIND_REPLACE_COMMAND, undefined)}>
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default Toolbar;
