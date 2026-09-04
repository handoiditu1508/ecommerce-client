import { Theme } from "@mui/material/styles";

/**
 * CSS rules shared between the live editor's content area and the read-only rendering of
 * persisted description HTML. Targets plain tags/attributes (not Lexical theme classes) so the
 * same rules work identically in both contexts - the editor's `.editor-content` and the read-only
 * page's container are otherwise unrelated DOM trees with no shared stylesheet.
 */
export function getSharedContentStyles(theme: Theme) {
  return {
    // A resized image carries explicit `width`/`height` HTML attributes (see ImageNode). Without
    // `height: auto`, `maxWidth: 100%` shrinking the rendered width on a narrower viewport leaves
    // that fixed height attribute in place and distorts the image's aspect ratio.
    img: { maxWidth: "100%", height: "auto" },
    "ul, ol": { margin: 0, paddingInlineStart: theme.spacing(3) },
    a: { color: theme.vars.palette.primary.main },
    // A left/right-aligned image uses CSS float, which otherwise bleeds past its own paragraph
    // and keeps pushing *every following* paragraph's text to its side. `flow-root` gives each
    // block its own formatting context so a float is contained to (and sizes) its own paragraph
    // only, without the side effects `overflow: hidden` would have on absolutely-positioned
    // overlays (the image's selection toolbar/resize handle) that intentionally protrude outside
    // it. Excludes `li`: overriding its default `display: list-item` would drop the bullet/number
    // marker.
    "p, h1, h2, h3, h4, h5, h6, blockquote": { display: "flow-root" as const },
    "h1, h2, h3, h4, h5, h6": { margin: theme.spacing(2, 0, 1) },
    blockquote: {
      margin: theme.spacing(1, 0),
      padding: theme.spacing(0.5, 0, 0.5, 2),
      borderLeft: `4px solid ${theme.vars.palette.divider}`,
      color: theme.vars.palette.text.secondary,
    },
    hr: {
      border: "none",
      borderTop: `1px solid ${theme.vars.palette.divider}`,
      margin: theme.spacing(2, 0),
    },
    table: { borderCollapse: "collapse" as const, width: "100%", margin: theme.spacing(1, 0) },
    "td, th": { border: `1px solid ${theme.vars.palette.divider}`, padding: theme.spacing(0.5, 1) },
    ".rte-inline-code": {
      fontFamily: "monospace",
      backgroundColor: theme.vars.palette.action.hover,
      padding: "0 4px",
      borderRadius: 3,
    },
    ".rte-code-block": {
      display: "block",
      position: "relative" as const,
      fontFamily: "monospace",
      backgroundColor: theme.vars.palette.action.hover,
      padding: theme.spacing(1.5),
      borderRadius: theme.shape.borderRadius,
      whiteSpace: "pre-wrap" as const,
      overflowX: "auto" as const,
    },
    // Prism token classes (see `codeHighlight` in RichTextEditor.tsx's LexicalComposer theme),
    // mapped onto the MUI palette instead of a full imported Prism theme stylesheet - keeps code
    // blocks visually consistent with the rest of the admin UI (and correct in dark mode).
    ".rte-token-comment": { color: theme.vars.palette.text.disabled },
    ".rte-token-punctuation": { color: theme.vars.palette.text.secondary },
    ".rte-token-property": { color: theme.vars.palette.secondary.main },
    ".rte-token-selector": { color: theme.vars.palette.success.main },
    ".rte-token-operator": { color: theme.vars.palette.warning.dark },
    ".rte-token-attr": { color: theme.vars.palette.info.main },
    ".rte-token-variable": { color: theme.vars.palette.warning.main },
    ".rte-token-function": { color: theme.vars.palette.error.main },
    ".rte-token-inserted": { backgroundColor: theme.vars.palette.success.light, color: theme.vars.palette.success.contrastText },
    ".rte-token-deleted": { backgroundColor: theme.vars.palette.error.light, color: theme.vars.palette.error.contrastText },
    ".rte-subscript": { verticalAlign: "sub" as const, fontSize: "0.8em" },
    ".rte-superscript": { verticalAlign: "super" as const, fontSize: "0.8em" },
    'li[role="checkbox"]': { listStyle: "none" as const, position: "relative" as const, paddingLeft: 28, cursor: "pointer" },
    'li[role="checkbox"]::before': {
      content: '""',
      position: "absolute" as const,
      left: 4,
      top: 3,
      width: 16,
      height: 16,
      border: `2px solid ${theme.vars.palette.text.secondary}`,
      borderRadius: 3,
      boxSizing: "border-box" as const,
    },
    'li[aria-checked="true"]::before': {
      backgroundColor: theme.vars.palette.primary.main,
      borderColor: theme.vars.palette.primary.main,
    },
    'li[aria-checked="true"]::after': {
      content: '""',
      position: "absolute" as const,
      left: 9,
      top: 6,
      width: 5,
      height: 9,
      border: "solid white",
      borderWidth: "0 2px 2px 0",
      transform: "rotate(45deg)",
    },
    ".rte-collapsible-container": {
      border: `1px solid ${theme.vars.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      margin: theme.spacing(1, 0),
      padding: theme.spacing(0.5, 1),
    },
    ".rte-collapsible-title": {
      cursor: "pointer",
      fontWeight: 600,
      "&::marker": { color: theme.vars.palette.text.secondary },
    },
    ".rte-collapsible-content": { padding: theme.spacing(0.5, 0, 0, 2) },
    ".rte-layout-container": { display: "grid", gap: theme.spacing(2), margin: theme.spacing(1, 0) },
    // Dashed border marks each column's boundary while editing, matching the Lexical playground's
    // own layout item styling - otherwise an empty/short column is invisible and easy to lose
    // track of.
    ".rte-layout-item": { minWidth: 0, maxWidth: "100%", border: `1px dashed ${theme.vars.palette.divider}`, padding: theme.spacing(1, 2) },
  };
}
