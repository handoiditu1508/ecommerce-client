import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import CloseIcon from "@mui/icons-material/Close";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { $getNodeByKey, $isTextNode, COMMAND_PRIORITY_EDITOR, createCommand, LexicalEditor, NodeKey } from "lexical";
import { $dfs } from "@lexical/utils";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

export const TOGGLE_FIND_REPLACE_COMMAND = createCommand<void>("TOGGLE_FIND_REPLACE_COMMAND");

type Match = { nodeKey: NodeKey; start: number; end: number; };

function findMatches(editor: LexicalEditor, query: string): Match[] {
  const matches: Match[] = [];
  if (!query) return matches;

  const needle = query.toLowerCase();
  editor.read("latest", () => {
    $dfs().forEach(({ node }) => {
      if (!$isTextNode(node)) return;

      const haystack = node.getTextContent().toLowerCase();
      let fromIndex = 0;
      let index = haystack.indexOf(needle, fromIndex);
      while (index !== -1) {
        matches.push({ nodeKey: node.getKey(), start: index, end: index + needle.length });
        fromIndex = index + needle.length;
        index = haystack.indexOf(needle, fromIndex);
      }
    });
  });

  return matches;
}

// A floating find/replace bar, docked top-right of the editor, toggled via TOGGLE_FIND_REPLACE_COMMAND
// (dispatched by a toolbar button). No official Lexical primitive for this - walks every TextNode
// for substring matches, navigates by selecting the current match's range, and replaces via
// TextNode.spliceText. Case-insensitive only, matching the scope of a product-description field.
function FindReplacePlugin({ anchorElem }: { anchorElem: HTMLElement | null; }) {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [visible, setVisible] = useState(false);
  const [showReplace, setShowReplace] = useState(false);
  const [query, setQuery] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => editor.registerCommand(TOGGLE_FIND_REPLACE_COMMAND, () => {
    setVisible((current) => !current);

    return true;
  }, COMMAND_PRIORITY_EDITOR), [editor]);

  const refreshMatches = useCallback((nextQuery: string, preferIndex?: number) => {
    const found = findMatches(editor, nextQuery);
    setMatches(found);
    setCurrentIndex(found.length === 0 ? 0 : Math.min(preferIndex ?? currentIndex, found.length - 1));
  }, [currentIndex, editor]);

  useEffect(() => {
    if (visible) refreshMatches(query, 0);
    // Only re-run when the query or visibility changes - refreshMatches itself changes identity
    // every render (it closes over currentIndex), which would otherwise re-search on every
    // navigation too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, visible]);

  useEffect(() => {
    if (!visible || matches.length === 0) return;

    const match = matches[currentIndex];
    editor.update(() => {
      const node = $getNodeByKey(match.nodeKey);
      if ($isTextNode(node)) node.select(match.start, match.end);
    });
  }, [currentIndex, editor, matches, visible]);

  if (!anchorElem) return null;

  const close = () => {
    setVisible(false);
    setMatches([]);
  };

  const goNext = () => {
    if (matches.length) setCurrentIndex((index) => (index + 1) % matches.length);
  };
  const goPrev = () => {
    if (matches.length) setCurrentIndex((index) => (index - 1 + matches.length) % matches.length);
  };

  const replaceCurrent = () => {
    if (matches.length === 0) return;

    const match = matches[currentIndex];
    editor.update(() => {
      const node = $getNodeByKey(match.nodeKey);
      if ($isTextNode(node)) node.spliceText(match.start, match.end - match.start, replaceValue, true);
    });
    refreshMatches(query, currentIndex);
  };

  const replaceAll = () => {
    if (matches.length === 0) return;

    const byNode = new Map<NodeKey, Match[]>();
    matches.forEach((match) => {
      const list = byNode.get(match.nodeKey) ?? [];
      list.push(match);
      byNode.set(match.nodeKey, list);
    });

    editor.update(() => {
      byNode.forEach((nodeMatches, nodeKey) => {
        const node = $getNodeByKey(nodeKey);
        if (!$isTextNode(node)) return;

        // Replace from the last match backwards so earlier offsets in the same node stay valid.
        [...nodeMatches].sort((a, b) => b.start - a.start).forEach((match) => {
          node.spliceText(match.start, match.end - match.start, replaceValue);
        });
      });
    });
    refreshMatches(query, 0);
  };

  return createPortal(
    visible && (
      <Paper elevation={3} sx={{ position: "absolute", top: 8, right: 8, zIndex: 3, p: 1 }}>
        <Stack gap={0.5}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <TextField
              size="small"
              variant="standard"
              autoFocus
              placeholder={t("find")}
              value={query}
              sx={{ width: 160 }}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (event.shiftKey) goPrev(); else goNext();
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  close();
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 44, textAlign: "center" }}>
              {matches.length === 0 ? t("empty") : `${currentIndex + 1}/${matches.length}`}
            </Typography>
            <Tooltip title={t("previous_match")}>
              <IconButton size="small" disabled={matches.length === 0} onClick={goPrev}>
                <KeyboardArrowUpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("next_match")}>
              <IconButton size="small" disabled={matches.length === 0} onClick={goNext}>
                <KeyboardArrowDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("toggle_replace")}>
              <IconButton size="small" color={showReplace ? "primary" : "default"} onClick={() => setShowReplace((current) => !current)}>
                <FindReplaceIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("close")}>
              <IconButton size="small" onClick={close}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          {showReplace && (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <TextField
                size="small"
                variant="standard"
                placeholder={t("replace")}
                value={replaceValue}
                sx={{ width: 160 }}
                onChange={(event) => setReplaceValue(event.target.value)}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "Enter") {
                    event.preventDefault();
                    replaceCurrent();
                  }
                }}
              />
              <Button size="small" disabled={matches.length === 0} onClick={replaceCurrent}>
                {t("replace")}
              </Button>
              <Button size="small" disabled={matches.length === 0} onClick={replaceAll}>
                {t("replace_all")}
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    ),
    anchorElem,
  );
}

export default FindReplacePlugin;
