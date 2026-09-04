import { $isCodeNode, DEFAULT_CODE_LANGUAGE, getLanguageFriendlyName } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { $getNearestNodeFromDOMNode, isHTMLElement } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

// Hover overlay on a code block showing its language and a copy-to-clipboard button, matching the
// Lexical playground's `CodeActionMenuPlugin` - minus its Prettier-format button (see the
// reimplementation plan's Context section for why that's out of scope here).
function CodeActionMenu({ anchorElem }: { anchorElem: HTMLElement; }) {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [codeElement, setCodeElement] = useState<HTMLElement | null>(null);
  const [language, setLanguage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const target = event.target;
      if (!isHTMLElement(target)) return;
      if (containerRef.current?.contains(target)) return;

      const element = target.closest<HTMLElement>("code.rte-code-block");
      if (!element) {
        setCodeElement(null);

        return;
      }
      if (element === codeElement) return;

      editor.read("latest", () => {
        const node = $getNearestNodeFromDOMNode(element);
        if (!$isCodeNode(node)) return;
        setLanguage(getLanguageFriendlyName(node.getLanguage() || DEFAULT_CODE_LANGUAGE));
        setCodeElement(element);
      });
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener("pointermove", onPointerMove);
      rootElement?.addEventListener("pointermove", onPointerMove);
    });
  }, [editor, codeElement]);

  const copyCode = useCallback(() => {
    if (!codeElement) return;
    editor.read("latest", () => {
      const node = $getNearestNodeFromDOMNode(codeElement);
      if (!$isCodeNode(node)) return;
      navigator.clipboard.writeText(node.getTextContent()).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    });
  }, [codeElement, editor]);

  if (!codeElement) return null;

  const anchorRect = anchorElem.getBoundingClientRect();
  const codeRect = codeElement.getBoundingClientRect();

  return createPortal(
    <Stack
      ref={containerRef}
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={{
        position: "absolute",
        top: codeRect.top - anchorRect.top + 4,
        right: anchorRect.right - codeRect.right + 4,
        zIndex: 1,
      }}
    >
      <Typography variant="caption" color="text.secondary">{language}</Typography>
      <Tooltip title={copied ? t("copied") : t("copy")}>
        <IconButton size="small" onClick={copyCode}>
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Stack>,
    anchorElem,
  );
}

function CodeActionMenuPlugin({ anchorElem }: { anchorElem: HTMLElement | null; }) {
  if (!anchorElem) return null;

  return <CodeActionMenu anchorElem={anchorElem} />;
}

export default CodeActionMenuPlugin;
