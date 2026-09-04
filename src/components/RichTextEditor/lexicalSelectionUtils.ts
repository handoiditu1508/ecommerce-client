import { $isLinkNode } from "@lexical/link";
import { LexicalNode } from "lexical";

// Shared between Toolbar.tsx and the floating plugins (Phase 2), which both need to detect "is
// the selection inside a link" and read that link's URL.
export function selectionHasAncestor(node: LexicalNode, predicate: (node: LexicalNode) => boolean): boolean {
  let current: LexicalNode | null = node;
  while (current) {
    if (predicate(current)) return true;
    current = current.getParent();
  }

  return false;
}

export function getLinkUrl(node: LexicalNode): string | null {
  let current: LexicalNode | null = node;
  while (current) {
    if ($isLinkNode(current)) return current.getURL();
    current = current.getParent();
  }

  return null;
}
