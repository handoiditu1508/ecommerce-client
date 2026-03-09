import ProductCardList from "@/components/ProductCardList";
import ProductCardListSkeleton from "@/components/ProductCardList/ProductCardListSkeleton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

type PromotionalProductListProps = {
  title: string;
  loading?: boolean;
};

function PromotionalProductList({ title, loading }: PromotionalProductListProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Container maxWidth="md" fixed>
        <Typography variant="h5">{title}</Typography>
      </Container>
      {
        loading
          ? <ProductCardListSkeleton quantity={12} />
          : <ProductCardList quantity={12} />
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
