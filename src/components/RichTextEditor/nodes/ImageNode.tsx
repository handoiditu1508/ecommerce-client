import CONFIG from "@/configs";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { mdiFormatFloatLeft, mdiFormatFloatRight } from "@mdi/js";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import NotesIcon from "@mui/icons-material/Notes";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { useEffect, useRef, useState } from "react";
import { getLocalImageRegistry } from "../useLocalImageRegistry";

export type ImageAlignment = "none" | "left" | "center" | "right" | "wrap-left" | "wrap-right";
export type ImageUploadStatus = "idle" | "uploading" | "error";

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width?: number;
    height?: number;
    alignment?: ImageAlignment;
    caption?: string;
  },
  SerializedLexicalNode
>;

// "left"/"right"/"center" position the image alone on its own line (no text wrap); "wrap-left"/
// "wrap-right" float it so surrounding text flows around the opposite side - matches the Lexical
// playground's own float model for the latter, kept as our own addition for the former. Applied
// to the persisted <img> on export, which already carries an explicit width/height attribute from
// resizing, so `margin: auto` has something concrete to center/push against.
const ALIGNMENT_STYLE: Record<ImageAlignment, React.CSSProperties> = {
  none: {},
  left: { display: "block", margin: "0 auto 0 0" },
  center: { display: "block", margin: "0 auto" },
  right: { display: "block", margin: "0 0 0 auto" },
  "wrap-left": { float: "left", margin: "0 16px 8px 0" },
  "wrap-right": { float: "right", margin: "0 0 8px 16px" },
};

// Applied to the editor's wrapping <span>, which has no explicit width of its own - unlike the
// exported <img> (a replaced element, sized from its own width/height), a plain block-level <span>
// with `width: auto` stretches to fill its container, leaving no slack for `margin: auto`/
// `margin-left: auto` to push against. `width: fit-content` gives it one.
const EDITOR_ALIGNMENT_STYLE: Record<ImageAlignment, React.CSSProperties> = {
  ...ALIGNMENT_STYLE,
  left: { ...ALIGNMENT_STYLE.left, width: "fit-content" },
  center: { ...ALIGNMENT_STYLE.center, width: "fit-content" },
  right: { ...ALIGNMENT_STYLE.right, width: "fit-content" },
};

function resolveImageSrc(editor: LexicalEditor, src: string, localId: string | undefined): string {
  if (localId) return getLocalImageRegistry(editor).getObjectUrl(localId) ?? "";

  return src ? CONFIG.FILE_URL + src : "";
}

const MIN_IMAGE_DIMENSION = 40;

// 8 resize handles (4 corners + 4 edges), matching the Lexical playground's own image resizer.
// Corner drags lock aspect ratio (this editor's existing behavior); edge drags resize just that
// one axis independently - new in this reimplementation.
type HandlePosition = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
const CORNER_HANDLES: ReadonlySet<HandlePosition> = new Set(["ne", "se", "sw", "nw"]);
const HANDLE_STYLES: Record<HandlePosition, React.CSSProperties> = {
  n: { top: -6, left: "50%", marginLeft: -6, cursor: "ns-resize" },
  ne: { top: -6, right: -6, cursor: "nesw-resize" },
  e: { top: "50%", right: -6, marginTop: -6, cursor: "ew-resize" },
  se: { bottom: -6, right: -6, cursor: "nwse-resize" },
  s: { bottom: -6, left: "50%", marginLeft: -6, cursor: "ns-resize" },
  sw: { bottom: -6, left: -6, cursor: "nesw-resize" },
  w: { top: "50%", left: -6, marginTop: -6, cursor: "ew-resize" },
  nw: { top: -6, left: -6, cursor: "nwse-resize" },
};

// Handles Tab/keyboard-driven focus, which has no competing default action to fight.
function selectAllOnFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select();
}

// Handles mouse-driven focus. A click's default action also places the caret at the clicked
// position - and does so as part of `mouseup`, i.e. *after* the 'focus' event a fresh click
// causes, so a plain `select()` in `onFocus` alone gets immediately overwritten by it. Blocking
// that default action here and selecting explicitly wins in both cases: a fresh click (which
// fires focus + this) and a re-click on a field that already had focus (Lexical deliberately
// leaves DOM focus on a nested decorator input like this one alone - see the NodeSelection
// explanation on `reselectAndFocus` - so re-clicking it fires no new 'focus' event at all, only
// this).
function selectAllOnMouseUp(event: React.MouseEvent<HTMLInputElement>) {
  event.preventDefault();
  event.currentTarget.select();
}

function ImageComponent({
  nodeKey,
  editor,
  src,
  altText,
  localId,
  width,
  height,
  alignment,
  status,
  caption,
}: {
  nodeKey: NodeKey;
  editor: LexicalEditor;
  src: string;
  altText: string;
  localId?: string;
  width?: number;
  height?: number;
  alignment: ImageAlignment;
  status: ImageUploadStatus;
  caption?: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  // Set during an active drag; corner handles set both (ratio-locked), edge handles set only the
  // axis being dragged.
  const [draftSize, setDraftSize] = useState<{ width?: number; height?: number; }>();
  // Captured once the <img> loads, so both drag-resize and the numeric fields can derive the
  // other dimension without needing an active drag first (natural size isn't known until then).
  const naturalAspectRatioRef = useRef<number | undefined>(undefined);

  const resolveAspectRatio = () => naturalAspectRatioRef.current ?? (height && width ? height / width : undefined);
  // What the width/height fields (and the <img> itself) should currently show: the live drag
  // preview while dragging, otherwise the node's committed dimensions.
  const effectiveWidth = draftSize?.width ?? width;
  const effectiveHeight = draftSize?.height ?? height;

  const [widthInput, setWidthInput] = useState(() => String(effectiveWidth ?? ""));
  const [heightInput, setHeightInput] = useState(() => String(effectiveHeight ?? ""));

  // Keep the fields in sync with the live/committed dimensions without clobbering what the user
  // is actively typing into the other one.
  useEffect(() => setWidthInput(String(effectiveWidth ?? "")), [effectiveWidth]);
  useEffect(() => setHeightInput(String(effectiveHeight ?? "")), [effectiveHeight]);

  // Once shown (either because a caption already exists, or the user turned it on), the caption
  // field stays visible even if cleared back to empty - matches typical caption UX, and avoids the
  // field vanishing out from under someone still typing.
  const [showCaption, setShowCaption] = useState(!!caption);
  const [captionDraft, setCaptionDraft] = useState(caption ?? "");
  useEffect(() => setCaptionDraft(caption ?? ""), [caption]);
  const commitCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setCaption(captionDraft);
    });
  };

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CLICK_COMMAND,
      (event) => {
        if (event.target !== imageRef.current) return false;
        event.preventDefault();
        setSelected(!isSelected);

        return true;
      },
      COMMAND_PRIORITY_HIGH,
    ),
    editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event) => {
        if (!isSelected || !$isNodeSelection($getSelection())) return false;
        event.preventDefault();
        editor.update(() => $getNodeByKey(nodeKey)?.remove());

        return true;
      },
      COMMAND_PRIORITY_LOW,
    ),
    editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        if (!isSelected || !$isNodeSelection($getSelection())) return false;
        event.preventDefault();
        editor.update(() => $getNodeByKey(nodeKey)?.remove());

        return true;
      },
      COMMAND_PRIORITY_LOW,
    ),
  ), [editor, isSelected, nodeKey, setSelected]);

  const setAlignment = (nextAlignment: ImageAlignment) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setAlignment(nextAlignment);
    });
    reselectAndFocus();
  };

  const handleImageLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth && naturalHeight) naturalAspectRatioRef.current = naturalHeight / naturalWidth;
  };

  // Re-selects the node and restores editor focus. Doing this synchronously, right after the
  // `editor.update()` that changed dimensions, isn't enough on its own: `editor.focus()`'s DOM
  // `.focus()` call on the root (needed to make keyboard interaction with the image work again)
  // leaves no native Range behind for a NodeSelection, so the browser's own async
  // `selectionchange` event - which always fires a tick *after* the triggering action, never
  // synchronously with it - lets Lexical's selection-sync listener see a caret-less/stray native
  // selection and clobber our NodeSelection right back out from under us. Deferring to
  // `requestAnimationFrame`, which runs after that pending `selectionchange` has already been
  // processed, makes this the final, winning word instead of a doomed synchronous one.
  const reselectAndFocus = () => {
    requestAnimationFrame(() => {
      setSelected(true);
      editor.focus();
    });
  };

  const applyDimensions = (nextWidth: number, nextHeight: number | undefined) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setDimensions(nextWidth, nextHeight);
    });
    reselectAndFocus();
  };

  const commitWidthInput = () => {
    const parsed = Math.round(Number(widthInput));
    if (!Number.isFinite(parsed) || parsed < MIN_IMAGE_DIMENSION) {
      setWidthInput(String(width ?? ""));

      return;
    }
    const ratio = resolveAspectRatio();
    applyDimensions(parsed, ratio ? Math.round(parsed * ratio) : height);
  };

  const commitHeightInput = () => {
    const parsed = Math.round(Number(heightInput));
    if (!Number.isFinite(parsed) || parsed < MIN_IMAGE_DIMENSION) {
      setHeightInput(String(height ?? ""));

      return;
    }
    const ratio = resolveAspectRatio();
    applyDimensions(ratio ? Math.round(parsed / ratio) : (width ?? parsed), parsed);
  };

  // Clears the custom width/height back to the image's original/natural size.
  const resetDimensions = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setDimensions(undefined, undefined);
    });
    reselectAndFocus();
  };

  const startResize = (handle: HandlePosition): React.MouseEventHandler<HTMLDivElement> => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const image = imageRef.current;
    if (!image) return;

    const startX = event.clientX;
    const startY = event.clientY;
    const rect = image.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;
    const ratio = resolveAspectRatio();
    const isCorner = CORNER_HANDLES.has(handle);
    // Which direction of drag grows the image, per handle: dragging the west/north edges further
    // away from the image (left/up) still means "make it bigger", hence the sign flip there.
    const widthSign = handle.includes("w") ? -1 : handle.includes("e") ? 1 : 0;
    const heightSign = handle.includes("n") ? -1 : handle.includes("s") ? 1 : 0;

    const computeSize = (clientX: number, clientY: number) => {
      if (isCorner) {
        const nextWidth = Math.max(MIN_IMAGE_DIMENSION, Math.round(startWidth + ((clientX - startX) * widthSign)));

        return { width: nextWidth, height: ratio ? Math.round(nextWidth * ratio) : startHeight };
      }
      if (widthSign !== 0) {
        return { width: Math.max(MIN_IMAGE_DIMENSION, Math.round(startWidth + ((clientX - startX) * widthSign))) };
      }

      return { height: Math.max(MIN_IMAGE_DIMENSION, Math.round(startHeight + ((clientY - startY) * heightSign))) };
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      setDraftSize(computeSize(moveEvent.clientX, moveEvent.clientY));
    };
    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      const finalSize = computeSize(upEvent.clientX, upEvent.clientY);
      setDraftSize(undefined);
      // A dimension the drag didn't touch falls back to the image's current *rendered* size
      // (not the possibly-unset `width`/`height` prop) - dragging one edge on a still-natural-size
      // image needs to lock in a concrete value for the other axis too, not leave it unset.
      applyDimensions(finalSize.width ?? Math.round(startWidth), finalSize.height ?? Math.round(startHeight));
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <span style={{ position: "relative", display: "inline-block", ...EDITOR_ALIGNMENT_STYLE[alignment] }}>
      {isSelected && (
        <Stack
          direction="row"
          // Without this, a click here still reaches Lexical's own global click handling (nothing
          // in this Stack's onClick handlers stops it from bubbling), which replaces the
          // NodeSelection with a plain RangeSelection at the click point - deselecting the image
          // and hiding this whole toolbar right as a button in it is clicked.
          sx={{
            position: "absolute",
            top: -36,
            left: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <Tooltip title="Align left">
            <IconButton size="small" color={alignment === "left" ? "primary" : "default"} onClick={() => setAlignment("left")}>
              <AlignHorizontalLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align center">
            <IconButton size="small" color={alignment === "center" ? "primary" : "default"} onClick={() => setAlignment("center")}>
              <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align right">
            <IconButton size="small" color={alignment === "right" ? "primary" : "default"} onClick={() => setAlignment("right")}>
              <AlignHorizontalRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          <Tooltip title="Wrap left">
            <IconButton size="small" color={alignment === "wrap-left" ? "primary" : "default"} onClick={() => setAlignment("wrap-left")}>
              <MdiSvgIcon path={mdiFormatFloatLeft} fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Wrap right">
            <IconButton size="small" color={alignment === "wrap-right" ? "primary" : "default"} onClick={() => setAlignment("wrap-right")}>
              <MdiSvgIcon path={mdiFormatFloatRight} fontSize="small" />
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          <Tooltip title="Caption">
            <IconButton
              size="small"
              color={showCaption ? "primary" : "default"}
              onClick={() => {
                setShowCaption((current) => !current);
                reselectAndFocus();
              }}
            >
              <NotesIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete image">
            <IconButton
              size="small"
              onClick={() => {
                editor.update(() => $getNodeByKey(nodeKey)?.remove());
                clearSelected();
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Stack direction="row" alignItems="center" gap={0.5} sx={{ pl: 0.5, pr: 1 }}>
            <TextField
              size="small"
              variant="standard"
              // Not type="number": that input type doesn't support the text-selection APIs
              // (.select()), so focus-select-all below would silently no-op on it.
              type="text"
              value={widthInput}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  style: { width: 36, fontSize: 12, textAlign: "right" },
                  onMouseUp: selectAllOnMouseUp,
                },
              }}
              onChange={(event) => setWidthInput(event.target.value)}
              onFocus={selectAllOnFocus}
              // Discards an uncommitted edit - only Enter (below) applies a new size.
              onBlur={() => setWidthInput(String(effectiveWidth ?? ""))}
              onKeyDown={(event) => {
                // This <input> renders inside the contentEditable root, so an unstopped keydown
                // (Backspace, Ctrl/Cmd+A, arrow keys, ...) would bubble up to Lexical's own
                // command handlers - e.g. KEY_BACKSPACE_COMMAND, which would delete the whole
                // selected image instead of editing this field's text.
                event.stopPropagation();
                if (event.key !== "Enter") return;
                event.preventDefault();
                commitWidthInput();
              }}
              onClick={(event) => event.stopPropagation()}
            />
            <Typography variant="caption" color="text.secondary">×</Typography>
            <TextField
              size="small"
              variant="standard"
              type="text"
              value={heightInput}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  style: { width: 36, fontSize: 12, textAlign: "right" },
                  onMouseUp: selectAllOnMouseUp,
                },
              }}
              onChange={(event) => setHeightInput(event.target.value)}
              onFocus={selectAllOnFocus}
              onBlur={() => setHeightInput(String(effectiveHeight ?? ""))}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key !== "Enter") return;
                event.preventDefault();
                commitHeightInput();
              }}
              onClick={(event) => event.stopPropagation()}
            />
            <Typography variant="caption" color="text.secondary">px</Typography>
          </Stack>
          <Tooltip title="Reset size">
            <IconButton size="small" onClick={resetDimensions}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      <img
        ref={imageRef}
        src={resolveImageSrc(editor, src, localId)}
        alt={altText}
        width={effectiveWidth}
        height={effectiveHeight}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          outline: isSelected ? "2px solid" : undefined,
          outlineColor: isSelected ? "primary.main" : undefined,
          opacity: status === "uploading" ? 0.5 : 1,
        }}
        onLoad={handleImageLoad}
      />
      {showCaption && (
        <TextField
          size="small"
          variant="standard"
          fullWidth
          placeholder="Add a caption"
          value={captionDraft}
          slotProps={{ input: { sx: { fontSize: 13, textAlign: "center" }, disableUnderline: !isSelected } }}
          sx={{ display: "block", mt: 0.5, "& input": { textAlign: "center" } }}
          onChange={(event) => setCaptionDraft(event.target.value)}
          onBlur={commitCaption}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key !== "Enter") return;
            event.preventDefault();
            commitCaption();
            event.currentTarget.blur();
          }}
          onClick={(event) => event.stopPropagation()}
        />
      )}
      {status === "uploading" && (
        <CircularProgress size={28} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-14px", ml: "-14px" }} />
      )}
      {status === "error" && (
        <Tooltip title="Upload failed">
          <ErrorIcon color="error" sx={{ position: "absolute", top: 4, right: 4, bgcolor: "background.paper", borderRadius: "50%" }} />
        </Tooltip>
      )}
      {isSelected && (Object.keys(HANDLE_STYLES) as HandlePosition[]).map((handle) => (
        <div
          key={handle}
          title="Drag to resize"
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...HANDLE_STYLES[handle],
          }}
          onMouseDown={startResize(handle)}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid white", background: "#1976d2" }} />
        </div>
      ))}
    </span>
  );
}

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLImageElement)) return null;

  // Read raw attributes, not `.src`/`.width`, which the browser resolves/computes and would
  // corrupt a BE-relative path (e.g. "/uploads/x.jpg") or substitute a rendered pixel size.
  const src = domNode.getAttribute("src") ?? "";
  const altText = domNode.getAttribute("alt") ?? "";
  const localId = domNode.getAttribute("data-local-id") ?? undefined;
  const widthAttr = domNode.getAttribute("width");
  const heightAttr = domNode.getAttribute("height");
  const alignment = (domNode.getAttribute("data-align") as ImageAlignment | null) ?? "none";

  return {
    node: $createImageNode(src, altText, localId, {
      width: widthAttr ? Number(widthAttr) : undefined,
      height: heightAttr ? Number(heightAttr) : undefined,
      alignment,
    }),
  };
}

// A captioned image round-trips as `<figure data-align=...><img ...><figcaption>...</figcaption></figure>`
// instead of a bare `<img>` (see `ImageNode.exportDOM`) - this is the matching import side. Returning
// a node here for the whole `<figure>` means Lexical treats this subtree as fully handled, so the
// nested `<img>` is never separately re-matched by `convertImageElement` above.
function convertFigureElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement) || domNode.tagName !== "FIGURE") return null;
  const img = domNode.querySelector("img");
  if (!img) return null;

  const src = img.getAttribute("src") ?? "";
  const altText = img.getAttribute("alt") ?? "";
  const localId = img.getAttribute("data-local-id") ?? undefined;
  const widthAttr = img.getAttribute("width");
  const heightAttr = img.getAttribute("height");
  const alignment = (domNode.getAttribute("data-align") as ImageAlignment | null) ?? "none";
  const caption = domNode.querySelector("figcaption")?.textContent ?? undefined;

  return {
    node: $createImageNode(src, altText, localId, {
      width: widthAttr ? Number(widthAttr) : undefined,
      height: heightAttr ? Number(heightAttr) : undefined,
      alignment,
      caption,
    }),
  };
}

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __localId?: string;
  __width?: number;
  __height?: number;
  __alignment: ImageAlignment;
  __status: ImageUploadStatus = "idle";
  __caption?: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    const cloned = new ImageNode(node.__src, node.__altText, node.__localId, {
      width: node.__width,
      height: node.__height,
      alignment: node.__alignment,
      caption: node.__caption,
    }, node.__key);
    cloned.__status = node.__status;

    return cloned;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(serializedNode.src, serializedNode.altText, undefined, {
      width: serializedNode.width,
      height: serializedNode.height,
      alignment: serializedNode.alignment,
      caption: serializedNode.caption,
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__localId ? "" : this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      alignment: this.__alignment,
      caption: this.__caption,
    };
  }

  constructor(
    src: string,
    altText: string,
    localId?: string,
    options?: { width?: number; height?: number; alignment?: ImageAlignment; caption?: string; },
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__localId = localId;
    this.__width = options?.width;
    this.__height = options?.height;
    this.__alignment = options?.alignment ?? "none";
    this.__caption = options?.caption;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement("img");
    img.setAttribute("src", this.__localId ? "" : this.__src);
    img.setAttribute("alt", this.__altText);
    if (this.__localId) img.setAttribute("data-local-id", this.__localId);
    if (this.__width) img.setAttribute("width", String(this.__width));
    if (this.__height) img.setAttribute("height", String(this.__height));

    if (!this.__caption) {
      if (this.__alignment !== "none") {
        img.setAttribute("data-align", this.__alignment);
        Object.assign(img.style, ALIGNMENT_STYLE[this.__alignment]);
      }

      return { element: img };
    }

    // A caption needs a block-level wrapper - the alignment float/margin moves from the <img>
    // itself to the <figure>, since floating just the <img> would leave the caption text
    // outside/beside the float instead of stacked directly under the image.
    const figure = document.createElement("figure");
    figure.style.margin = "0";
    if (this.__alignment !== "none") {
      figure.setAttribute("data-align", this.__alignment);
      Object.assign(figure.style, ALIGNMENT_STYLE[this.__alignment]);
    }
    figure.appendChild(img);
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = this.__caption;
    figcaption.style.cssText = "font-size: 0.85em; text-align: center; margin-top: 4px;";
    figure.appendChild(figcaption);

    return { element: figure };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: () => ({
        conversion: convertFigureElement,
        priority: 1,
      }),
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  getLocalId(): string | undefined {
    return this.__localId;
  }

  getCaption(): string | undefined {
    return this.__caption;
  }

  setCaption(caption: string): void {
    this.getWritable().__caption = caption || undefined;
  }

  getStatus(): ImageUploadStatus {
    return this.__status;
  }

  /** Swaps a pending local image for its persisted path, clearing the local marker. */
  setResolved(filePath: string): void {
    const writable = this.getWritable();
    writable.__src = filePath;
    writable.__localId = undefined;
    writable.__status = "idle";
  }

  setStatus(status: ImageUploadStatus): void {
    this.getWritable().__status = status;
  }

  setDimensions(width: number | undefined, height: number | undefined): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setAlignment(alignment: ImageAlignment): void {
    this.getWritable().__alignment = alignment;
  }

  decorate(editor: LexicalEditor): React.JSX.Element {
    return (
      <ImageComponent
        nodeKey={this.getKey()}
        editor={editor}
        src={this.__src}
        altText={this.__altText}
        localId={this.__localId}
        width={this.__width}
        height={this.__height}
        alignment={this.__alignment}
        status={this.__status}
        caption={this.__caption}
      />
    );
  }
}

export function $createImageNode(
  src: string,
  altText: string,
  localId?: string,
  options?: { width?: number; height?: number; alignment?: ImageAlignment; caption?: string; },
): ImageNode {
  return new ImageNode(src, altText, localId, options);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
