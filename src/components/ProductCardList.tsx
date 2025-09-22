import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import ProductCard from "./ProductCard";

type ProductCardListProps = {
  quantity: number;
};

function ProductCardList({ quantity }: ProductCardListProps) {
  const theme = useTheme();

  return (
    <Box sx={{
      mt: 2,
      mx: "auto",
      px: "16px",
      boxSizing: "border-box",
      maxWidth: theme.breakpoints.values.md - 20, // 20px is to prevent horizontal scrollbar
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      [smAndDownMediaQuery(theme.breakpoints)]: {
        maxWidth: theme.breakpoints.values.sm - 20, // 20px is to prevent horizontal scrollbar
        px: "10px",
        gap: "10px",
      },
      [xsAndDownMediaQuery(theme.breakpoints)]: {
        maxWidth: theme.breakpoints.values.xs - 20, // 20px is to prevent horizontal scrollbar
        px: "2px",
        gap: "6px",
      },
    }}>
      {[...new Array(quantity)].map((_, index) => <ProductCard key={index} />)}
    </Box>
  );
}

export default ProductCardList;
