import CONFIG from "@/configs";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import AlignHorizontalRightIcon from "@mui/icons-material/AlignHorizontalRight";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
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

export type ImageAlignment = "none" | "left" | "center" | "right";
export type ImageUploadStatus = "idle" | "uploading" | "error";

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width?: number;
    height?: number;
    alignment?: ImageAlignment;
  },
  SerializedLexicalNode
>;

// Applied to the persisted <img> on export, which already carries an explicit width/height
// attribute from resizing, so `margin: auto` has something concrete to center against.
const ALIGNMENT_STYLE: Record<ImageAlignment, React.CSSProperties> = {
  none: {},
  left: { float: "left", margin: "0 16px 8px 0" },
  right: { float: "right", margin: "0 0 8px 16px" },
  center: { display: "block", margin: "0 auto" },
};

// Applied to the editor's wrapping <span>, which has no explicit width of its own - unlike the
// exported <img>, `margin: auto` needs `width: fit-content` here or there's nothing to center.
const EDITOR_ALIGNMENT_STYLE: Record<ImageAlignment, React.CSSProperties> = {
  ...ALIGNMENT_STYLE,
  center: { ...ALIGNMENT_STYLE.center, width: "fit-content" },
};

function resolveImageSrc(editor: LexicalEditor, src: string, localId: string | undefined): string {
  if (localId) return getLocalImageRegistry(editor).getObjectUrl(localId) ?? "";

  return src ? CONFIG.FILE_URL + src : "";
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
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  const [draftWidth, setDraftWidth] = useState<number>();

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
  };

  const startResize: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const image = imageRef.current;
    if (!image) return;

    const startX = event.clientX;
    const startWidth = image.getBoundingClientRect().width;
    const aspectRatio = image.naturalHeight && image.naturalWidth
      ? image.naturalHeight / image.naturalWidth
      : (height && width ? height / width : undefined);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.max(40, Math.round(startWidth + (moveEvent.clientX - startX)));
      setDraftWidth(nextWidth);
    };
    const onMouseUp = (upEvent: MouseEvent) => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      const finalWidth = Math.max(40, Math.round(startWidth + (upEvent.clientX - startX)));
      setDraftWidth(undefined);
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setDimensions(finalWidth, aspectRatio ? Math.round(finalWidth * aspectRatio) : undefined);
        }
      });
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <span style={{ position: "relative", display: alignment === "center" ? "block" : "inline-block", ...EDITOR_ALIGNMENT_STYLE[alignment] }}>
      {isSelected && (
        <Stack
          direction="row"
          sx={{
            position: "absolute",
            top: -36,
            left: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
          }}
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
          <Tooltip title="Delete image">
            <IconButton
              size="small"
              onClick={() => {
                editor.update(() => $getNodeByKey(nodeKey)?.remove());
                clearSelected();
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      <img
        ref={imageRef}
        src={resolveImageSrc(editor, src, localId)}
        alt={altText}
        width={draftWidth ?? width}
        height={draftWidth ? undefined : height}
        style={{
          maxWidth: "100%",
          display: "block",
          outline: isSelected ? "2px solid" : undefined,
          outlineColor: isSelected ? "primary.main" : undefined,
          opacity: status === "uploading" ? 0.5 : 1,
        }}
      />
      {status === "uploading" && (
        <CircularProgress size={28} sx={{ position: "absolute", top: "50%", left: "50%", mt: "-14px", ml: "-14px" }} />
      )}
      {status === "error" && (
        <Tooltip title="Upload failed">
          <ErrorIcon color="error" sx={{ position: "absolute", top: 4, right: 4, bgcolor: "background.paper", borderRadius: "50%" }} />
        </Tooltip>
      )}
      {isSelected && (
        <div
          title="Drag to resize"
          style={{
            position: "absolute",
            right: -8,
            bottom: -8,
            width: 20,
            height: 20,
            cursor: "nwse-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseDown={startResize}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid white", background: "#1976d2" }} />
        </div>
      )}
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

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __localId?: string;
  __width?: number;
  __height?: number;
  __alignment: ImageAlignment;
  __status: ImageUploadStatus = "idle";

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    const cloned = new ImageNode(node.__src, node.__altText, node.__localId, {
      width: node.__width,
      height: node.__height,
      alignment: node.__alignment,
    }, node.__key);
    cloned.__status = node.__status;

    return cloned;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(serializedNode.src, serializedNode.altText, undefined, {
      width: serializedNode.width,
      height: serializedNode.height,
      alignment: serializedNode.alignment,
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
    };
  }

  constructor(
    src: string,
    altText: string,
    localId?: string,
    options?: { width?: number; height?: number; alignment?: ImageAlignment; },
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__localId = localId;
    this.__width = options?.width;
    this.__height = options?.height;
    this.__alignment = options?.alignment ?? "none";
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__localId ? "" : this.__src);
    element.setAttribute("alt", this.__altText);
    if (this.__localId) element.setAttribute("data-local-id", this.__localId);
    if (this.__width) element.setAttribute("width", String(this.__width));
    if (this.__height) element.setAttribute("height", String(this.__height));
    if (this.__alignment !== "none") {
      element.setAttribute("data-align", this.__alignment);
      Object.assign(element.style, ALIGNMENT_STYLE[this.__alignment]);
    }

    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  getLocalId(): string | undefined {
    return this.__localId;
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
      />
    );
  }
}

export function $createImageNode(
  src: string,
  altText: string,
  localId?: string,
  options?: { width?: number; height?: number; alignment?: ImageAlignment; },
): ImageNode {
  return new ImageNode(src, altText, localId, options);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
