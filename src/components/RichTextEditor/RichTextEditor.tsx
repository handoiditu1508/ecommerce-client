import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { $nodesOfType, LexicalEditor } from "lexical";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { generateHtml, hydrateFromHtml } from "./htmlContent";
import { ImageNode } from "./nodes/ImageNode";
import ImageDropPastePlugin from "./plugins/ImageDropPastePlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import Toolbar from "./Toolbar";
import { getLocalImageRegistry } from "./useLocalImageRegistry";

export type PendingImage = { localId: string; file: File; };
export type ResolvedImage = { localId: string; filePath: string; };

export type RichTextEditorHandle = {
  /** Pending (not-yet-uploaded) images currently inserted in the editor, in document order. */
  getPendingImages: () => PendingImage[];
  /** Swaps resolved pending images to their persisted paths in place, without a full re-hydrate. */
  resolvePendingImages: (resolved: ResolvedImage[]) => void;
};

type RichTextEditorProps = {
  value?: string;
  label?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onValueChange: (value: string) => void;
};

const StyledStack = styled(Stack)(({ theme }) => ({
  border: theme.vars.border.smallBorder,
  borderColor: theme.vars.palette.action.active,
  borderRadius: theme.shape.borderRadius,
  boxSizing: "border-box",
  "&:not(.disabled):not(.readonly):focus-within": {
    borderColor: theme.vars.palette.primary.main,
  },
  "&.error": {
    borderColor: theme.vars.palette.error.main,
  },
  "&.disabled": {
    borderColor: theme.vars.palette.action.disabled,
    backgroundColor: theme.vars.palette.action.disabledBackground,
  },
  "&.readonly": {
    borderColor: theme.vars.palette.divider,
    backgroundColor: theme.vars.palette.action.hover,
  },
  ".editor-content": {
    minHeight: 160,
    padding: theme.spacing(1, 1.5),
    outline: "none",
    img: { maxWidth: "100%" },
    "ul, ol": { margin: 0, paddingInlineStart: theme.spacing(3) },
    a: { color: theme.vars.palette.primary.main },
    ".rte-underline": { textDecoration: "underline" },
  },
  ".editor-placeholder": {
    color: theme.vars.palette.text.disabled,
    pointerEvents: "none",
    position: "absolute",
    padding: theme.spacing(1, 1.5),
  },
}));

// Bridges the Lexical editor instance (only reachable from inside LexicalComposer's context) up to
// RichTextEditor's imperative handle and keeps it in sync with the controlled `value` prop.
function EditorBridge({
  editorRef,
  value,
  disabled,
  readOnly,
  onValueChange,
}: {
  editorRef: React.MutableRefObject<LexicalEditor | null>;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
  onValueChange: (value: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const lastEmittedHtmlRef = useRef(value);
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  editorRef.current = editor;

  useEffect(() => editor.registerUpdateListener(({ tags }) => {
    if (tags.has("programmatic-update")) return;
    const html = generateHtml(editor);
    lastEmittedHtmlRef.current = html;
    onValueChangeRef.current(html);
  }), [editor]);

  useEffect(() => {
    if (value !== lastEmittedHtmlRef.current) {
      hydrateFromHtml(editor, value);
      lastEmittedHtmlRef.current = value;
    }
  }, [editor, value]);

  useEffect(() => {
    editor.setEditable(!disabled && !readOnly);
  }, [editor, disabled, readOnly]);

  // Revoke any still-pending local image object URLs when this editor instance unmounts.
  useEffect(() => () => getLocalImageRegistry(editor).clear(), [editor]);

  return null;
}

function RichTextEditor(
  { value = "", label, required, disabled, readOnly, fullWidth, error, helperText, onBlur, onValueChange }: RichTextEditorProps,
  ref: React.Ref<RichTextEditorHandle>,
) {
  const editorRef = useRef<LexicalEditor | null>(null);

  useImperativeHandle(ref, () => ({
    getPendingImages: () => {
      const editor = editorRef.current;
      if (!editor) return [];

      const registry = getLocalImageRegistry(editor);
      const pending: PendingImage[] = [];
      editor.getEditorState().read(() => {
        $nodesOfType(ImageNode).forEach((node) => {
          const localId = node.getLocalId();
          const file = localId ? registry.getLocalFile(localId) : undefined;
          if (localId && file) pending.push({ localId, file });
        });
      });

      return pending;
    },
    resolvePendingImages: (resolved) => {
      const editor = editorRef.current;
      if (!editor) return;

      const registry = getLocalImageRegistry(editor);
      const filePathByLocalId = new Map(resolved.map((r) => [r.localId, r.filePath]));
      editor.update(() => {
        $nodesOfType(ImageNode).forEach((node) => {
          const localId = node.getLocalId();
          const filePath = localId ? filePathByLocalId.get(localId) : undefined;
          if (filePath !== undefined) node.setResolved(filePath);
        });
      }, { tag: "programmatic-update" });
      resolved.forEach((r) => registry.resolve(r.localId));
    },
  }), []);

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "RichTextEditor",
        nodes: [ListNode, ListItemNode, LinkNode, ImageNode],
        editable: !disabled && !readOnly,
        onError: (err) => console.error(err),
        // Bold/italic render via native <strong>/<em> tags (browser-styled by default), but
        // underline has no such tag fallback in Lexical and is only applied via this theme class.
        theme: {
          text: {
            underline: "rte-underline",
          },
        },
      }}
    >
      <EditorBridge
        editorRef={editorRef}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onValueChange={onValueChange}
      />
      <Stack sx={{ width: fullWidth ? "100%" : undefined, mt: 2 }}>
        {label && <FormLabel required={required} error={error} disabled={disabled}>{label}</FormLabel>}
        <StyledStack
          className={[error && "error", disabled && "disabled", readOnly && "readonly"].filter(Boolean).join(" ")}
        >
          {!readOnly && <Toolbar />}
          <div style={{ position: "relative" }}>
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-content" onBlur={onBlur} />}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <ImagesPlugin />
          <ImageDropPastePlugin />
        </StyledStack>
        {helperText && <FormHelperText error={error} disabled={disabled}>{helperText}</FormHelperText>}
      </Stack>
    </LexicalComposer>
  );
}

export default forwardRef(RichTextEditor);
