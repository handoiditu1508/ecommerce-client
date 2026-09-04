import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, ElementNode, LexicalNode } from "lexical";

function convertContentElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement) || !domNode.hasAttribute("data-lexical-collapsible-content")) return null;

  return { node: $createCollapsibleContentNode() };
}

// The body of a collapsible section - always the second child of a CollapsibleContainerNode (see
// CollapsiblePlugin's structure-enforcing transform), rendered as the <details>'s non-<summary>
// content.
export class CollapsibleContentNode extends ElementNode {
  static getType(): string {
    return "collapsible-content";
  }

  static clone(node: CollapsibleContentNode): CollapsibleContentNode {
    return new CollapsibleContentNode(node.__key);
  }

  isShadowRoot(): boolean {
    return true;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "rte-collapsible-content";

    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode) => (domNode.hasAttribute("data-lexical-collapsible-content")
        ? { conversion: convertContentElement, priority: 1 }
        : null),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("div");
    element.className = "rte-collapsible-content";
    element.setAttribute("data-lexical-collapsible-content", "true");

    return { element };
  }

  static importJSON(): CollapsibleContentNode {
    return $createCollapsibleContentNode();
  }
}

export function $createCollapsibleContentNode(): CollapsibleContentNode {
  return new CollapsibleContentNode();
}

export function $isCollapsibleContentNode(node: LexicalNode | null | undefined): node is CollapsibleContentNode {
  return node instanceof CollapsibleContentNode;
}
