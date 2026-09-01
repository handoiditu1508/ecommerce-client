import CONFIG from "@/configs";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, LexicalEditor } from "lexical";

/** Serializes the editor's current content to an HTML string (relative image paths, never CONFIG.FILE_URL-prefixed). */
export function generateHtml(editor: LexicalEditor): string {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });

  return html;
}

/**
 * Replaces the editor's content with the given persisted HTML (relative image paths). Tagged
 * "programmatic-update" so the caller's update listener can skip re-emitting this as a value
 * change (avoids marking a freshly-loaded form dirty from the Lexical HTML round-trip).
 */
export function hydrateFromHtml(editor: LexicalEditor, html: string): void {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    if (!html) return;

    const dom = new DOMParser().parseFromString(html, "text/html");
    const nodes = $generateNodesFromDOM(editor, dom);
    root.select();
    $insertNodes(nodes);
  }, { tag: "programmatic-update" });
}

/**
 * Prefixes every relative `<img src>` in persisted HTML with `CONFIG.FILE_URL`, for read-only
 * display outside the editor (e.g. the product detail page), which never loads Lexical.
 */
export function resolveContentImageUrls(html?: string): string {
  if (!html) return "";

  const dom = new DOMParser().parseFromString(html, "text/html");
  dom.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !/^(https?:)?\/\//.test(src)) {
      img.setAttribute("src", CONFIG.FILE_URL + src);
    }
  });

  return dom.body.innerHTML;
}
