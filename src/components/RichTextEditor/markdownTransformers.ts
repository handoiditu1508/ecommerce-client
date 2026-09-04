import { TextMatchTransformer } from "@lexical/markdown";
import { DEFAULT_TRANSFORMERS } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { $createImageNode, ImageNode } from "./nodes/ImageNode";

// `DEFAULT_TRANSFORMERS` already covers everything `@lexical/markdown`'s own `TRANSFORMERS` does
// (headings, bold, italic, strikethrough, blockquote, lists, inline code, code block, highlight,
// link) plus a `---`/`***`/`___` horizontal-rule shortcut. The one thing missing for us is image
// markdown syntax, since that has to create our own custom `ImageNode` - no `export` side (we
// never serialize back to markdown, only HTML via `@lexical/html`), so only `replace` is needed.
const IMAGE_TRANSFORMER: TextMatchTransformer = {
  dependencies: [ImageNode],
  importRegExp: /!\[([^[]*)\]\(([^(]+)\)/,
  regExp: /!\[([^[]*)\]\(([^(]+)\)$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    textNode.replace($createImageNode(src, altText));
  },
  trigger: ")",
  type: "text-match",
};

export const RICH_TEXT_MARKDOWN_TRANSFORMERS = [...DEFAULT_TRANSFORMERS, IMAGE_TRANSFORMER];
