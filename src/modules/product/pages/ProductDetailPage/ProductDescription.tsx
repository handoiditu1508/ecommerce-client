import { resolveContentImageUrls } from "@/components/RichTextEditor";
import Box from "@mui/material/Box";
import Skeleton, { skeletonClasses } from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";

type ProductDescriptionProps = {
  content?: string;
  loading?: boolean;
};

function ProductDescription({ content, loading }: ProductDescriptionProps) {
  if (!loading && !content) return null;

  return (
    <Box
      component="section"
      sx={{
        mt: 4,
        [`.${skeletonClasses.rectangular}, img`]: {
          display: "block",
          mx: "auto",
          maxWidth: "100%",
        },
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
        : <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resolveContentImageUrls(content)) }} />}
    </Box>
  );
}

export default ProductDescription;
