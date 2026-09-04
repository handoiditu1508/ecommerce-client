import { $createCodeNode } from "@lexical/code";
import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageIcon from "@mui/icons-material/Image";
import Looks3Icon from "@mui/icons-material/Looks3";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import NotesIcon from "@mui/icons-material/Notes";
import TableChartIcon from "@mui/icons-material/TableChart";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
} from "lexical";
import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ALIGNMENTS } from "../Toolbar/formatOptions";
import { INSERT_COLLAPSIBLE_COMMAND } from "./CollapsiblePlugin";
import { insertEmbed } from "./EmbedPlugin";
import { insertImage } from "./ImagesPlugin";
import { INSERT_LAYOUT_COMMAND, LAYOUT_PRESETS } from "./LayoutPlugin";

export class ComponentPickerOption extends MenuOption {
  title: string;
  keywords: string[];
  onSelect: () => void;

  // Reuses the base class's own (optional) `icon: JSX.Element` field rather than redeclaring one -
  // TS doesn't allow a subclass to widen an inherited property's type.
  constructor(title: string, options: { icon: React.JSX.Element; keywords?: string[]; onSelect: () => void; }) {
    super(title);
    this.title = title;
    this.icon = options.icon;
    this.keywords = options.keywords ?? [];
    this.onSelect = options.onSelect;
  }
}

// The item list shared between the "/" slash-command menu below and the draggable block handle's
// "+" menu (see DraggableBlockPlugin.tsx) - both let the user insert the same set of blocks, just
// from a different trigger. Scoped to what's relevant for a product-description field - see the
// Context section of the reimplementation plan for what's deliberately excluded (comments/mentions/
// polls/equations/etc.).
export function useComponentPickerOptions(
  editor: LexicalEditor,
  hiddenImageInputRef: RefObject<HTMLInputElement | null>,
): ComponentPickerOption[] {
  const { t } = useTranslation();

  const setBlock = useCallback((createNode: () => ElementNode) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, createNode);
    });
  }, [editor]);

  const insertHeading = useCallback((tag: HeadingTagType) => setBlock(() => $createHeadingNode(tag)), [setBlock]);

  return useMemo<ComponentPickerOption[]>(() => [
    new ComponentPickerOption(t("paragraph"), {
      icon: <NotesIcon fontSize="small" />,
      onSelect: () => setBlock(() => $createParagraphNode()),
    }),
    new ComponentPickerOption(t("heading_n", "", { level: 1 }), {
      icon: <LooksOneIcon fontSize="small" />,
      keywords: ["h1"],
      onSelect: () => insertHeading("h1"),
    }),
    new ComponentPickerOption(t("heading_n", "", { level: 2 }), {
      icon: <LooksTwoIcon fontSize="small" />,
      keywords: ["h2"],
      onSelect: () => insertHeading("h2"),
    }),
    new ComponentPickerOption(t("heading_n", "", { level: 3 }), {
      icon: <Looks3Icon fontSize="small" />,
      keywords: ["h3"],
      onSelect: () => insertHeading("h3"),
    }),
    new ComponentPickerOption(t("quote"), {
      icon: <FormatQuoteIcon fontSize="small" />,
      onSelect: () => setBlock(() => $createQuoteNode()),
    }),
    new ComponentPickerOption(t("code_block"), {
      icon: <CodeIcon fontSize="small" />,
      keywords: ["code"],
      onSelect: () => setBlock(() => $createCodeNode()),
    }),
    new ComponentPickerOption(t("bulleted_list"), {
      icon: <FormatListBulletedIcon fontSize="small" />,
      keywords: ["ul", "list"],
      onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption(t("numbered_list"), {
      icon: <FormatListNumberedIcon fontSize="small" />,
      keywords: ["ol", "list"],
      onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption(t("checklist"), {
      icon: <CheckBoxIcon fontSize="small" />,
      keywords: ["todo", "list"],
      onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption(t("insert_table"), {
      icon: <TableChartIcon fontSize="small" />,
      keywords: ["table"],
      onSelect: () => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: "3", columns: "3" }),
    }),
    new ComponentPickerOption(t("insert_horizontal_rule"), {
      icon: <HorizontalRuleIcon fontSize="small" />,
      keywords: ["hr", "divider"],
      onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    new ComponentPickerOption(t("insert_collapsible"), {
      icon: <UnfoldMoreIcon fontSize="small" />,
      keywords: ["collapse", "toggle", "details"],
      onSelect: () => editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    }),
    ...LAYOUT_PRESETS.map(({ labelKey, template }) => new ComponentPickerOption(t(labelKey), {
      icon: <ViewColumnIcon fontSize="small" />,
      keywords: ["columns", "layout"],
      onSelect: () => editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template),
    })),
    new ComponentPickerOption(t("insert_image"), {
      icon: <ImageIcon fontSize="small" />,
      keywords: ["picture", "photo"],
      onSelect: () => hiddenImageInputRef.current?.click(),
    }),
    new ComponentPickerOption(t("insert_video"), {
      icon: <VideoLibraryIcon fontSize="small" />,
      keywords: ["embed", "youtube", "vimeo"],
      // A quick `prompt()` rather than a new popover subsystem here - the primary toolbar's
      // Insert menu already has the polished version of this same flow.
      onSelect: () => {
        const url = window.prompt(t("youtube_or_vimeo_url"));
        if (url) insertEmbed(editor, url);
      },
    }),
    ...ALIGNMENTS.map(({ value, icon, label }) => new ComponentPickerOption(t(label), {
      icon: icon as React.JSX.Element,
      keywords: ["align"],
      onSelect: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value),
    })),
  ], [editor, hiddenImageInputRef, insertHeading, setBlock, t]);
}

// "/" slash-command menu, built on Lexical's official typeahead-menu primitive.
function ComponentPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);
  const hiddenImageInputRef = useRef<HTMLInputElement>(null);
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", { minLength: 0 });
  const allOptions = useComponentPickerOptions(editor, hiddenImageInputRef);

  const options = useMemo(() => {
    if (!query) return allOptions;

    const lowerQuery = query.toLowerCase();

    return allOptions.filter(
      (option) => option.title.toLowerCase().includes(lowerQuery)
        || option.keywords.some((keyword) => keyword.includes(lowerQuery)),
    );
  }, [allOptions, query]);

  return (
    <>
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
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        options={options}
        triggerFn={checkForTriggerMatch}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options: renderOptions },
        ) => {
          if (!anchorElementRef.current || renderOptions.length === 0) return null;

          return (
            <Popper open anchorEl={anchorElementRef.current} placement="bottom-start" sx={{ zIndex: 1300 }}>
              <Paper elevation={3} sx={{ maxHeight: 320, overflowY: "auto", minWidth: 220, mt: 0.5 }}>
                <MenuList dense>
                  {renderOptions.map((option, index) => (
                    <MenuItem
                      key={option.key}
                      selected={index === selectedIndex}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                      }}
                    >
                      <ListItemIcon>{option.icon}</ListItemIcon>
                      <ListItemText>{option.title}</ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </Popper>
          );
        }}
        onQueryChange={setQuery}
        onSelectOption={(option, textNodeContainingQuery, closeMenu) => {
          editor.update(() => textNodeContainingQuery?.remove());
          option.onSelect();
          closeMenu();
        }}
      />
    </>
  );
}

export default ComponentPickerPlugin;
