import CONFIG from "@/configs";
import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { getLocalImageRegistry } from "../useLocalImageRegistry";

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
  },
  SerializedLexicalNode
>;

function resolveImageSrc(editor: LexicalEditor, src: string, localId: string | undefined): string {
  if (localId) return getLocalImageRegistry(editor).getObjectUrl(localId) ?? "";

  return src ? CONFIG.FILE_URL + src : "";
}

function ImageComponent({
  editor,
  src,
  altText,
  localId,
}: {
  editor: LexicalEditor;
  src: string;
  altText: string;
  localId?: string;
}) {
  return (
    <img
      src={resolveImageSrc(editor, src, localId)}
      alt={altText}
      style={{ maxWidth: "100%" }}
    />
  );
}

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLImageElement)) return null;

  // Read the raw attribute, not the `.src` property, which the browser resolves to an absolute
  // URL against the document's base and would corrupt a BE-relative path (e.g. "/uploads/x.jpg").
  const src = domNode.getAttribute("src") ?? "";
  const altText = domNode.getAttribute("alt") ?? "";
  const localId = domNode.getAttribute("data-local-id") ?? undefined;

  return { node: $createImageNode(src, altText, localId) };
}

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __localId?: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__localId, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(serializedNode.src, serializedNode.altText);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__localId ? "" : this.__src,
      altText: this.__altText,
    };
  }

  constructor(src: string, altText: string, localId?: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__localId = localId;
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

  /** Swaps a pending local image for its persisted path, clearing the local marker. */
  setResolved(filePath: string): void {
    const writable = this.getWritable();
    writable.__src = filePath;
    writable.__localId = undefined;
  }

  decorate(editor: LexicalEditor): React.JSX.Element {
    return (
      <ImageComponent
        editor={editor}
        src={this.__src}
        altText={this.__altText}
        localId={this.__localId}
      />
    );
  }
}

export function $createImageNode(src: string, altText: string, localId?: string): ImageNode {
  return new ImageNode(src, altText, localId);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}
