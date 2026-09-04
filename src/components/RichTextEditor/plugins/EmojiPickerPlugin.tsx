import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import { $createTextNode } from "lexical";
import { useMemo, useState } from "react";
import { EMOJI_LIST } from "../emojiList";

class EmojiOption extends MenuOption {
  emoji: string;
  title: string;
  keywords: string[];

  constructor(emoji: string, title: string, keywords: string[]) {
    super(`${title}-${emoji}`);
    this.emoji = emoji;
    this.title = title;
    this.keywords = keywords;
  }
}

const ALL_OPTIONS = EMOJI_LIST.map(({ emoji, name, keywords }) => new EmojiOption(emoji, name, keywords));

// ":" trigger emoji picker, built on the same official typeahead-menu primitive as the "/" slash
// menu (ComponentPickerPlugin.tsx) - a small self-authored curated list (emojiList.ts) instead of
// an emoji-database dependency, inserting the literal character as plain text (simpler than a
// dedicated EmojiNode - no styling/analytics need here).
function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(":", { minLength: 1 });

  const options = useMemo(() => {
    if (!query) return ALL_OPTIONS.slice(0, 10);

    const lowerQuery = query.toLowerCase();

    return ALL_OPTIONS.filter(
      (option) => option.title.includes(lowerQuery) || option.keywords.some((keyword) => keyword.includes(lowerQuery)),
    ).slice(0, 10);
  }, [query]);

  return (
    <LexicalTypeaheadMenuPlugin<EmojiOption>
      options={options}
      triggerFn={checkForTriggerMatch}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options: renderOptions },
      ) => {
        if (!anchorElementRef.current || renderOptions.length === 0) return null;

        return (
          <Popper open anchorEl={anchorElementRef.current} placement="bottom-start" sx={{ zIndex: 1300 }}>
            <Paper elevation={3} sx={{ maxHeight: 260, overflowY: "auto", minWidth: 180, mt: 0.5 }}>
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
                    <Typography component="span" sx={{ mr: 1 }}>{option.emoji}</Typography>
                    <Typography component="span" variant="body2" sx={{ textTransform: "capitalize" }}>{option.title}</Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Popper>
        );
      }}
      onQueryChange={setQuery}
      onSelectOption={(option, textNodeContainingQuery, closeMenu) => {
        editor.update(() => {
          textNodeContainingQuery?.replace($createTextNode(option.emoji));
        });
        closeMenu();
      }}
    />
  );
}

export default EmojiPickerPlugin;
