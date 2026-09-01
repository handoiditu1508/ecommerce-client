import { getSharedContentStyles, resolveContentImageUrls } from "@/components/RichTextEditor";
import Box from "@mui/material/Box";
import Skeleton, { skeletonClasses } from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";

type ProductDescriptionProps = {
  content?: string;
  loading?: boolean;
};

function ProductDescription({ content, loading }: ProductDescriptionProps) {
  const theme = useTheme();
  if (!loading && !content) return null;

  return (
    <Box
      component="section"
      sx={{
        mt: 4,
        // Only the loading skeleton is force-centered here. A real `<img>`'s alignment is driven
        // by ImageNode.exportDOM's inline style (float/margin for left/right/center, nothing for
        // the default "none") - an unconditional rule for `img` here would override that "none"
        // case and center images the editor itself renders unaligned.
        [`.${skeletonClasses.rectangular}`]: {
          display: "block",
          mx: "auto",
          maxWidth: "100%",
        },
        ...getSharedContentStyles(theme),
      }}>
      {loading
        ? <>
          <Typography variant="h5"><Skeleton variant="text" width={200} /></Typography>
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="50%" />
          <br />
          <Skeleton variant="rectangular" width={600} height={400} />
        </>
        : <Box
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(resolveContentImageUrls(content), {
              // Video embeds are iframes; DOMPurify excludes <iframe> by default. Safe here because
              // the editor only ever writes youtube-nocookie.com/player.vimeo.com embed URLs into
              // `src` (see EmbedNode.resolveEmbedUrl) - never an arbitrary attacker-controlled URL.
              ADD_TAGS: ["iframe"],
              ADD_ATTR: ["allow", "allowfullscreen", "sandbox", "data-embed-url", "data-embed-provider", "data-align", "data-local-id"],
            }),
          }}
        />}
    </Box>
  );
}

export default ProductDescription;
