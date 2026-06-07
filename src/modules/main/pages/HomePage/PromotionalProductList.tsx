import CustomButton from "@/components/CustomButton";
import ProductCardList from "@/components/ProductCardList";
import CONFIG from "@/configs";
import { ProductView } from "@/models/entities/Product";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { To } from "react-router-dom";

type PromotionalProductListProps = {
  title: string;
  products?: ProductView[];
  loading?: boolean;
  viewAllUrlPath?: To;
  onRefresh?: () => void;
};

function PromotionalProductList({
  title,
  products = CONFIG.EMPTY_ARRAY,
  loading,
  viewAllUrlPath,
  onRefresh = CONFIG.EMPTY_FUNCTION,
}: PromotionalProductListProps) {
  const { t: tMain } = useTranslation("main");

  return (
    <Box sx={{ mt: 4 }}>
      <Container maxWidth="md" fixed>
        <Typography variant="h5">{title}</Typography>
      </Container>
      {(loading || products.length) && <ProductCardList products={products} loading={loading} />}
      {!loading && products.length && viewAllUrlPath && <CustomButton
        to={viewAllUrlPath}
        variant="outlined"
        disabled={loading}
        sx={{
          display: "flex",
          mx: "auto",
          mt: 2,
          width: "fit-content",
        }}>
        {tMain("view_all")}
      </CustomButton>}
      {!loading && !products.length && <Stack alignItems="center">
        <WarningIcon fontSize="large" />
        <Typography variant="body2">{tMain("error_loading_products")}</Typography>
        <Button
          variant="text"
          disabled={loading}
          startIcon={<RefreshIcon />}
          sx={{
            mt: 2,
          }}
          onClick={onRefresh}>
          {tMain("refresh")}
        </Button>
      </Stack>}
    </Box>
  );
}

export default PromotionalProductList;
