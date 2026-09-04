import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementNode,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  Spread,
} from "lexical";

export type SerializedLayoutContainerNode = Spread<{ templateColumns: string; }, SerializedElementNode>;

function convertLayoutContainerElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement) || !domNode.hasAttribute("data-lexical-layout-container")) return null;

  return { node: $createLayoutContainerNode(domNode.style.gridTemplateColumns) };
}

// A CSS-grid row of fixed-width columns (see LayoutPlugin's INSERT_LAYOUT_COMMAND for the presets
// this project offers - 2 and 3 equal columns), simplified from the playground's own
// `LayoutContainerNode`: no arbitrary-ratio template-editing UI, just fixed presets.
export class LayoutContainerNode extends ElementNode {
  __templateColumns: string;

  constructor(templateColumns: string, key?: NodeKey) {
    super(key);
    this.__templateColumns = templateColumns;
  }

  static getType(): string {
    return "layout-container";
  }

  static clone(node: LayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(node.__templateColumns, node.__key);
  }

  isShadowRoot(): boolean {
    return true;
  }

  canBeEmpty(): boolean {
    return false;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "rte-layout-container";
    dom.style.gridTemplateColumns = this.__templateColumns;

    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement): boolean {
    if (prevNode.__templateColumns !== this.__templateColumns) dom.style.gridTemplateColumns = this.__templateColumns;

    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode) => (domNode.hasAttribute("data-lexical-layout-container")
        ? { conversion: convertLayoutContainerElement, priority: 1 }
        : null),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.className = "rte-layout-container";
    element.style.gridTemplateColumns = this.__templateColumns;
    element.setAttribute("data-lexical-layout-container", "true");

    return { element };
  }

  static importJSON(serializedNode: SerializedLayoutContainerNode): LayoutContainerNode {
    return $createLayoutContainerNode(serializedNode.templateColumns);
  }

  exportJSON(): SerializedLayoutContainerNode {
    return { ...super.exportJSON(), templateColumns: this.__templateColumns };
  }

  getTemplateColumns(): string {
    return this.getLatest().__templateColumns;
  }
}

export function $createLayoutContainerNode(templateColumns = ""): LayoutContainerNode {
  return new LayoutContainerNode(templateColumns);
}

export function $isLayoutContainerNode(node: LexicalNode | null | undefined): node is LayoutContainerNode {
  return node instanceof LayoutContainerNode;
}
