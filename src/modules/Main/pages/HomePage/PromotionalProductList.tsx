import ProductCardList from "@/components/ProductCardList";
import ProductCardListSkeleton from "@/components/ProductCardList/ProductCardListSkeleton";
import CONFIG from "@/configs";
import { ProductView } from "@/models/entities/Product";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

type PromotionalProductListProps = {
  title: string;
  products?: ProductView[];
  loading?: boolean;
};

function PromotionalProductList({
  title,
  products = CONFIG.EMPTY_ARRAY,
  loading,
}: PromotionalProductListProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Container maxWidth="md" fixed>
        <Typography variant="h5">{title}</Typography>
      </Container>
      {
        loading
          ? <ProductCardListSkeleton quantity={12} />
          : <ProductCardList products={products} />
      }
      <Button
        variant="outlined"
        disabled={loading}
        sx={{
          display: "flex",
          mx: "auto",
          mt: 2,
        }}>
        View All
      </Button>
    </Box>
  );
}

export default PromotionalProductList;
