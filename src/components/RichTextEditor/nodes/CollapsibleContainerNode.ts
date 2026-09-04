import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";

export type SerializedCollapsibleContainerNode = Spread<{ open: boolean; }, SerializedElementNode>;

function convertDetailsElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLDetailsElement)) return null;

  return { node: $createCollapsibleContainerNode(domNode.open) };
}

// A collapsible section (`<details>`), simplified from the Lexical playground's own
// `CollapsibleContainerNode` - dropped its Chrome/Firefox-specific `<div>`-instead-of-`<details>`
// workaround (for animation bugs we don't need to solve here) in favor of relying on native
// `<details>/<summary>` toggle behavior directly, in all browsers.
export class CollapsibleContainerNode extends ElementNode {
  __open: boolean;

  constructor(open: boolean, key?: NodeKey) {
    super(key);
    this.__open = open;
  }

  static getType(): string {
    return "collapsible-container";
  }

  static clone(node: CollapsibleContainerNode): CollapsibleContainerNode {
    return new CollapsibleContainerNode(node.__open, node.__key);
  }

  isShadowRoot(): boolean {
    return true;
  }

  createDOM(_config: unknown, editor: LexicalEditor): HTMLElement {
    const dom = document.createElement("details");
    dom.className = "rte-collapsible-container";
    dom.open = this.__open;
    // Native <summary> clicks already toggle the <details> element itself - this listener only
    // syncs that native state back into the Lexical node so exportDOM/exportJSON stay accurate.
    dom.addEventListener("toggle", () => {
      editor.update(() => {
        const latest = this.getLatest();
        if (latest.getOpen() !== dom.open) latest.setOpen(dom.open);
      });
    });

    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLDetailsElement): boolean {
    if (prevNode.__open !== this.__open) dom.open = this.__open;

    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return { details: () => ({ conversion: convertDetailsElement, priority: 1 }) };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("details");
    element.className = "rte-collapsible-container";
    if (this.__open) element.setAttribute("open", "");

    return { element };
  }

  static importJSON(serializedNode: SerializedCollapsibleContainerNode): CollapsibleContainerNode {
    return $createCollapsibleContainerNode(serializedNode.open);
  }

  exportJSON(): SerializedCollapsibleContainerNode {
    return { ...super.exportJSON(), open: this.__open };
  }

  setOpen(open: boolean): void {
    this.getWritable().__open = open;
  }

  getOpen(): boolean {
    return this.getLatest().__open;
  }
}

export function $createCollapsibleContainerNode(open: boolean): CollapsibleContainerNode {
  return new CollapsibleContainerNode(open);
}

export function $isCollapsibleContainerNode(node: LexicalNode | null | undefined): node is CollapsibleContainerNode {
  return node instanceof CollapsibleContainerNode;
}
