import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, ElementNode, LexicalNode } from "lexical";

function convertLayoutItemElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement) || !domNode.hasAttribute("data-lexical-layout-item")) return null;

  return { node: $createLayoutItemNode() };
}

// One column of a LayoutContainerNode row.
export class LayoutItemNode extends ElementNode {
  static getType(): string {
    return "layout-item";
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  isShadowRoot(): boolean {
    return true;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "rte-layout-item";

    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode) => (domNode.hasAttribute("data-lexical-layout-item")
        ? { conversion: convertLayoutItemElement, priority: 1 }
        : null),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.className = "rte-layout-item";
    element.setAttribute("data-lexical-layout-item", "true");

    return { element };
  }

  static importJSON(): LayoutItemNode {
    return $createLayoutItemNode();
  }
}

export function $createLayoutItemNode(): LayoutItemNode {
  return new LayoutItemNode();
}

export function $isLayoutItemNode(node: LexicalNode | null | undefined): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
