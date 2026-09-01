import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoLinkPlugin, createLinkMatcherWithRegExp } from "@lexical/react/LexicalAutoLinkPlugin";
import { EmbedConfig, LexicalAutoEmbedPlugin, AutoEmbedOption } from "@lexical/react/LexicalAutoEmbedPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { $nodesOfType, LexicalEditor } from "lexical";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import i18n from "@/i18n";
import { getSharedContentStyles } from "./contentStyles";
import { generateHtml, hydrateFromHtml } from "./htmlContent";
import { EmbedNode, resolveEmbedUrl } from "./nodes/EmbedNode";
import { ImageNode } from "./nodes/ImageNode";
import EmbedPlugin, { insertEmbed } from "./plugins/EmbedPlugin";
import HorizontalRulePlugin from "./plugins/HorizontalRulePlugin";
import ImageDropPastePlugin from "./plugins/ImageDropPastePlugin";
import ImagesPlugin, { ImagePickerRenderProps } from "./plugins/ImagesPlugin";
import Toolbar from "./Toolbar";
import { getLocalImageRegistry } from "./useLocalImageRegistry";

export type PendingImage = { localId: string; file: File; };
export type ResolvedImage = { localId: string; filePath: string; };

export type RichTextEditorHandle = {
  /** Pending (not-yet-uploaded) images currently inserted in the editor, in document order. */
  getPendingImages: () => PendingImage[];
  /** Swaps resolved pending images to their persisted paths in place, without a full re-hydrate. */
  resolvePendingImages: (resolved: ResolvedImage[]) => void;
  /** Shows an uploading indicator on the given pending images (call around the upload request). */
  markImagesUploading: (localIds: string[]) => void;
  /** Shows an error indicator on the given pending images (call when the upload request fails). */
  markImagesFailed: (localIds: string[]) => void;
};

// AutoLinkPlugin's internal effect depends on this array by reference, so it must stay a single
// stable module-level constant - an inline `[URL_MATCHER]` literal in JSX would be a new array on
// every render, causing the effect to unregister/re-register forever (infinite render loop).
const AUTO_LINK_MATCHERS = [
  createLinkMatcherWithRegExp(
    /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i,
    (text) => (text.startsWith("http") ? text : `https://${text}`),
  ),
];

// AutoEmbedPlugin's internal effects depend on `embedConfigs`/`getMenuOptions` by reference too
// (the same pitfall as AUTO_LINK_MATCHERS above), so both stay stable module-level values.
// `insertNode` only needs `result.url`, which is on the base (untyped-data) EmbedMatchResult
// shape regardless - no need for a generic data type here (and `EmbedConfig<TData>` is
// contravariant in `insertNode`'s parameter, so a concrete TData wouldn't satisfy the plugin's
// bare `EmbedConfig` constraint anyway).
const EMBED_CONFIGS: EmbedConfig[] = [
  {
    type: "video",
    parseUrl: (text) => {
      const resolved = resolveEmbedUrl(text);

      return resolved ? { url: text, id: resolved.embedUrl } : null;
    },
    insertNode: (editor, result) => insertEmbed(editor, result.url),
  },
];

function getEmbedMenuOptions(_activeEmbedConfig: EmbedConfig, embedFn: () => void) {
  return [new AutoEmbedOption(i18n.t("embed_video"), { onSelect: () => embedFn() })];
}

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
  /**
   * Opt-in "insert from library" toolbar button. Omit to keep the editor's default,
   * upload-only image flow - RichTextEditor stays agnostic about where library images come
   * from; the consumer supplies its own picker UI (e.g. a dialog over a product's existing
   * images) and calls `onSelect` with the chosen image's already-persisted src.
   */
  renderImagePicker?: (props: ImagePickerRenderProps) => React.ReactNode;
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
    ...getSharedContentStyles(theme),
    // Bold/italic/underline/strikethrough export to real <b>/<i>/<u>/<s> tags (browser-styled by
    // default), but the *live editing* DOM only gets those tags for bold/italic - underline and
    // strikethrough need this explicit theme class while editing.
    ".rte-underline": { textDecoration: "underline" },
    ".rte-strikethrough": { textDecoration: "line-through" },
    ".rte-underline-strikethrough": { textDecoration: "underline line-through" },
    // lowercase/uppercase/capitalize apply `text-transform` inline automatically on HTML export
    // (Lexical's own TextNode.exportDOM), but not while live-editing - same theme-class gap.
    ".rte-lowercase": { textTransform: "lowercase" },
    ".rte-uppercase": { textTransform: "uppercase" },
    ".rte-capitalize": { textTransform: "capitalize" },
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
  { value = "", label, required, disabled, readOnly, fullWidth, error, helperText, onBlur, onValueChange, renderImagePicker }: RichTextEditorProps,
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
    markImagesUploading: (localIds) => {
      const editor = editorRef.current;
      if (!editor) return;

      const localIdSet = new Set(localIds);
      editor.update(() => {
        $nodesOfType(ImageNode).forEach((node) => {
          const localId = node.getLocalId();
          if (localId && localIdSet.has(localId)) node.setStatus("uploading");
        });
      }, { tag: "programmatic-update" });
    },
    markImagesFailed: (localIds) => {
      const editor = editorRef.current;
      if (!editor) return;

      const localIdSet = new Set(localIds);
      editor.update(() => {
        $nodesOfType(ImageNode).forEach((node) => {
          const localId = node.getLocalId();
          if (localId && localIdSet.has(localId)) node.setStatus("error");
        });
      }, { tag: "programmatic-update" });
    },
  }), []);

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "RichTextEditor",
        nodes: [
          ListNode,
          ListItemNode,
          LinkNode,
          AutoLinkNode,
          ImageNode,
          EmbedNode,
          HeadingNode,
          QuoteNode,
          CodeNode,
          HorizontalRuleNode,
          TableNode,
          TableRowNode,
          TableCellNode,
        ],
        editable: !disabled && !readOnly,
        onError: (err) => console.error(err),
        // Bold/italic render via native <strong>/<em> tags (browser-styled by default), but the
        // other text formats have no such tag fallback in Lexical and need an explicit theme class.
        theme: {
          text: {
            underline: "rte-underline",
            strikethrough: "rte-strikethrough",
            underlineStrikethrough: "rte-underline-strikethrough",
            subscript: "rte-subscript",
            superscript: "rte-superscript",
            code: "rte-inline-code",
            lowercase: "rte-lowercase",
            uppercase: "rte-uppercase",
            capitalize: "rte-capitalize",
          },
          code: "rte-code-block",
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
          {!readOnly && <Toolbar renderImagePicker={renderImagePicker} />}
          <div style={{ position: "relative" }}>
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-content" onBlur={onBlur} />}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <ClickableLinkPlugin newTab />
          <AutoLinkPlugin matchers={AUTO_LINK_MATCHERS} />
          <LexicalAutoEmbedPlugin embedConfigs={EMBED_CONFIGS} getMenuOptions={getEmbedMenuOptions} />
          <TablePlugin />
          <ImagesPlugin />
          <ImageDropPastePlugin />
          <EmbedPlugin />
          <HorizontalRulePlugin />
          <TabIndentationPlugin />
          <SelectionAlwaysOnDisplay />
        </StyledStack>
        {helperText && <FormHelperText error={error} disabled={disabled}>{helperText}</FormHelperText>}
      </Stack>
    </LexicalComposer>
  );
}

export default forwardRef(RichTextEditor);
