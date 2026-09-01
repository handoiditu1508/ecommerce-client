import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
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
import { useEffect } from "react";

export type EmbedProvider = "youtube" | "vimeo";

export type SerializedEmbedNode = Spread<
  {
    url: string;
    embedUrl: string;
    provider: EmbedProvider;
  },
  SerializedLexicalNode
>;

/**
 * Only known video providers are embeddable: the raw URL is validated and transformed into that
 * provider's official embed form, so we never iframe an arbitrary attacker-controlled URL.
 */
export function resolveEmbedUrl(url: string): { embedUrl: string; provider: EmbedProvider; } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "m.youtube.com") {
    const videoId = parsed.searchParams.get("v");
    if (videoId) return { embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`, provider: "youtube" };
  }

  if (host === "youtu.be") {
    const videoId = parsed.pathname.slice(1);
    if (videoId) return { embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`, provider: "youtube" };
  }

  if (host === "vimeo.com") {
    const videoId = parsed.pathname.split("/").filter(Boolean)[0];
    if (videoId && /^\d+$/.test(videoId)) return { embedUrl: `https://player.vimeo.com/video/${videoId}`, provider: "vimeo" };
  }

  return null;
}

function EmbedComponent({ nodeKey, editor, embedUrl }: { nodeKey: NodeKey; editor: LexicalEditor; embedUrl: string; }) {
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CLICK_COMMAND,
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || !target.closest(`[data-node-key="${nodeKey}"]`)) return false;
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

  return (
    <Box
      data-node-key={nodeKey}
      sx={{
        position: "relative",
        maxWidth: 560,
        outline: isSelected ? "2px solid" : undefined,
        outlineColor: "primary.main",
      }}
    >
      <Box sx={{ position: "relative", pt: "56.25%" }}>
        <iframe
          src={embedUrl}
          title="Embedded video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </Box>
      {isSelected && (
        <IconButton
          size="small"
          sx={{ position: "absolute", top: 4, right: 4, bgcolor: "background.paper" }}
          onClick={() => {
            editor.update(() => $getNodeByKey(nodeKey)?.remove());
            clearSelected();
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

function convertEmbedElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLElement)) return null;

  const url = domNode.getAttribute("data-embed-url");
  if (!url) return null;

  const resolved = resolveEmbedUrl(url);
  if (!resolved) return null;

  return { node: $createEmbedNode(url, resolved.embedUrl, resolved.provider) };
}

export class EmbedNode extends DecoratorNode<React.JSX.Element> {
  __url: string;
  __embedUrl: string;
  __provider: EmbedProvider;

  static getType(): string {
    return "embed";
  }

  static clone(node: EmbedNode): EmbedNode {
    return new EmbedNode(node.__url, node.__embedUrl, node.__provider, node.__key);
  }

  static importJSON(serializedNode: SerializedEmbedNode): EmbedNode {
    return $createEmbedNode(serializedNode.url, serializedNode.embedUrl, serializedNode.provider);
  }

  exportJSON(): SerializedEmbedNode {
    return {
      type: "embed",
      version: 1,
      url: this.__url,
      embedUrl: this.__embedUrl,
      provider: this.__provider,
    };
  }

  constructor(url: string, embedUrl: string, provider: EmbedProvider, key?: NodeKey) {
    super(key);
    this.__url = url;
    this.__embedUrl = embedUrl;
    this.__provider = provider;
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  // Wraps the iframe in a responsive (16:9) padding-box, self-contained via inline styles so it
  // renders correctly wherever the persisted HTML ends up, independent of any page's stylesheet.
  exportDOM(): DOMExportOutput {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-embed-url", this.__url);
    wrapper.setAttribute("data-embed-provider", this.__provider);
    Object.assign(wrapper.style, { position: "relative", paddingTop: "56.25%", maxWidth: "560px" });

    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", this.__embedUrl);
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
    Object.assign(iframe.style, { position: "absolute", inset: "0", width: "100%", height: "100%", border: "0" });

    wrapper.appendChild(iframe);

    return { element: wrapper };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode) => (domNode.hasAttribute("data-embed-url")
        ? { conversion: convertEmbedElement, priority: 1 }
        : null),
    };
  }

  decorate(editor: LexicalEditor): React.JSX.Element {
    return <EmbedComponent nodeKey={this.getKey()} editor={editor} embedUrl={this.__embedUrl} />;
  }
}

export function $createEmbedNode(url: string, embedUrl: string, provider: EmbedProvider): EmbedNode {
  return new EmbedNode(url, embedUrl, provider);
}

export function $isEmbedNode(node: LexicalNode | null | undefined): node is EmbedNode {
  return node instanceof EmbedNode;
}
