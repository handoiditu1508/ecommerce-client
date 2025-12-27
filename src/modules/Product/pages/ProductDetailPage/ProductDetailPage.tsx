import { toVndCurrency } from "@/common/formats";
import CustomLink from "@/components/CustomLink";
import NumberSpinner from "@/components/NumberSpinner";
import { BreakpointsContext, smAndDownMediaQuery } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import ProductAttributeSelector from "../../components/ProductAttributeSelector";
import ProductAttributeSelectorDialog from "../../components/ProductAttributeSelectorDialog";
import ImageCarousel from "./ImageCarousel";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";
import SocialSharingButtonGroup from "./SocialSharingButtonGroup";

function ProductDetailPage() {
  const theme = useTheme();
  const { xsAndDown, smAndDown, sm, smAndUp, mdAndUp } = useContext(BreakpointsContext);
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);

  const handleAddToCartButtonClick = () => {
    if (smAndDown) {
      setAttributeDialogOpen(true);
    }
  };

  const ProductTitle = <Typography variant="h3">Product Title</Typography>;

  const ProductBrand = <Typography variant="subtitle1">Brand <CustomLink to="">Product Brand</CustomLink></Typography>;

  const ProductPrice = (
    <Box>
      <Typography variant="h5" color="primary" fontWeight={700}>{toVndCurrency(80000)}</Typography>
      <Typography variant="body1" color="textDisabled" sx={{ textDecorationLine: "line-through", display: "inline" }}>{toVndCurrency(100000)}</Typography>
      <Typography component="sup" color="error" variant="caption"> -20%</Typography>
    </Box>
  );

  const ProductRating = (
    <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "flex-end" }}>
      <Rating defaultValue={3.3} readOnly />
      <Typography variant="subtitle2" component="p" align="right">(3.3) 1k Reviews</Typography>
    </Stack>
  );

  const AddToCartButton = (
    <Button
      size="large"
      sx={{
        width: "100%",
        maxWidth: 500,
        mt: 4,
        mx: "auto",
      }}
      onClick={handleAddToCartButtonClick}>
      Add to cart
    </Button>
  );

  const QuantityInput = (
    <NumberSpinner
      min={0}
      defaultValue={1}
      size="small"
      sx={{
        maxWidth: 200,
        width: "100%",
        alignSelf: "flex-end",
        mt: 4,
      }}
    />
  );

  return (
    <LayoutContainer disableGutters={false}>
      <Box
        component="section"
        sx={{
          display: "flex",
          mt: 1,
          gap: 2,
        }}>
        {/* left */}
        <Box sx={{
          flexgrow: 0,
          flexShrink: 0,
          width: 434,
          maxWidth: `calc((100% - ${theme.spacing(2)}) / 2)`,
          flexDirection: "column",
          [smAndDownMediaQuery(theme.breakpoints)]: {
            flexGrow: 1,
            flexShrink: 1,
            maxWidth: "100%",
            width: "initial",
            display: "flex",
          },
        }}>
          {smAndDown && <Box sx={{ mb: 4 }}>
            {ProductTitle}
            <Stack direction="row" alignItems={{ xs: "flex-end", sm: "center" }}>
              <Box>
                {ProductBrand}
                {xsAndDown && ProductPrice}
              </Box>
              <Box sx={{ flex: 1 }} />
              {ProductRating}
            </Stack>
          </Box>}
          {xsAndDown && <SocialSharingButtonGroup />}
          <ImageCarousel />
          {smAndUp && <Box sx={{
            display: "flex",
            mt: 1,
            justifyContent: "space-between",
          }}>
            <SocialSharingButtonGroup />
            {sm && ProductPrice}
          </Box>}
          {smAndDown && <>
            {QuantityInput}
            {AddToCartButton}
            <ProductAttributeSelectorDialog open={attributeDialogOpen} confirmButtonText="Add to cart" onClose={() => setAttributeDialogOpen(false)} />
          </>}
        </Box>
        {/* right */}
        {mdAndUp && <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {ProductTitle}
          {ProductBrand}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
            {ProductPrice}
            {ProductRating}
          </Box>
          <Divider sx={{ my: 1 }} />
          <ProductAttributeSelector />
          {QuantityInput}
          {AddToCartButton}
        </Box>}
      </Box>
      <RelatedProducts />
      <ProductDescription />
    </LayoutContainer>
  );
}

export default ProductDetailPage;
