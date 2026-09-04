import {
  $createParagraphNode,
  $isElementNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  ElementNode,
  LexicalNode,
  RangeSelection,
} from "lexical";
import { $isCollapsibleContainerNode } from "./CollapsibleContainerNode";
import { $isCollapsibleContentNode } from "./CollapsibleContentNode";

function convertSummaryElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement) || domNode.tagName !== "SUMMARY") return null;

  return { node: $createCollapsibleTitleNode() };
}

// The always-visible heading of a collapsible section (`<summary>`) - always the first child of a
// CollapsibleContainerNode. Pressing Enter here (see `insertNewAfter`) moves the caret into the
// section's content instead of splitting the title into two lines.
export class CollapsibleTitleNode extends ElementNode {
  static getType(): string {
    return "collapsible-title";
  }

  static clone(node: CollapsibleTitleNode): CollapsibleTitleNode {
    return new CollapsibleTitleNode(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("summary");
    dom.className = "rte-collapsible-title";

    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return { summary: () => ({ conversion: convertSummaryElement, priority: 1 }) };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("summary");
    element.className = "rte-collapsible-title";

    return { element };
  }

  static importJSON(): CollapsibleTitleNode {
    return $createCollapsibleTitleNode();
  }

  insertNewAfter(_selection: RangeSelection, restoreSelection = true): ElementNode {
    const containerNode = this.getParentOrThrow();
    if (!$isCollapsibleContainerNode(containerNode)) {
      const paragraph = $createParagraphNode();
      this.insertAfter(paragraph, restoreSelection);

      return paragraph;
    }

    if (!containerNode.getOpen()) containerNode.setOpen(true);

    const contentNode = containerNode.getChildAtIndex(1);
    if ($isCollapsibleContentNode(contentNode)) {
      const firstChild = contentNode.getFirstChild();
      if ($isElementNode(firstChild)) return firstChild;

      const paragraph = $createParagraphNode();
      contentNode.append(paragraph);

      return paragraph;
    }

    const paragraph = $createParagraphNode();
    containerNode.insertAfter(paragraph, restoreSelection);

    return paragraph;
  }
}

export function $createCollapsibleTitleNode(): CollapsibleTitleNode {
  return new CollapsibleTitleNode();
}

export function $isCollapsibleTitleNode(node: LexicalNode | null | undefined): node is CollapsibleTitleNode {
  return node instanceof CollapsibleTitleNode;
}
