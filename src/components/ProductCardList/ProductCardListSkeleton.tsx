import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";

type ProductCardListSkeletonProps = {
  quantity: number;
};

function ProductCardListSkeleton({ quantity }: ProductCardListSkeletonProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      mt: 2,
      mx: "auto",
      px: 2,
      boxSizing: "border-box",
      maxWidth: theme.breakpoints.values.md - 20, // 20px is to prevent horizontal scrollbar
      display: "flex",
      gap: 2,
      flexWrap: "wrap",
      justifyContent: "center",
      [smAndDownMediaQuery(theme.breakpoints)]: {
        maxWidth: theme.breakpoints.values.sm - 20, // 20px is to prevent horizontal scrollbar
        px: 1.25,
        gap: 1.25,
      },
      [xsAndDownMediaQuery(theme.breakpoints)]: {
        maxWidth: theme.breakpoints.values.xs - 20, // 20px is to prevent horizontal scrollbar
        px: 0.25,
        gap: 0.75,
      },
    }}>
      {[...new Array(quantity)].map((_, index) => <ProductCardSkeleton key={index} />)}
    </Box>
  );
}

export default ProductCardListSkeleton;
