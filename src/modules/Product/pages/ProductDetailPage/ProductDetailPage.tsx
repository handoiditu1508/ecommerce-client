import { toVndCurrency } from "@/common/formats";
import NumberSpinner from "@/components/NumberSpinner";
import { BreakpointsContext, smAndDownMediaQuery } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { GetProductQuery } from "@/models/apis/product/getProduct";
import { useGetProductQuery } from "@/redux/apis/productApi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import ProductVariantSelector from "../../components/ProductVariantSelector";
import ProductVariantSelectorDialog from "../../components/ProductVariantSelectorDialog";
import ImageCarousel from "./ImageCarousel";
import ProductBrandLink from "./ProductBrandLink";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";
import SocialSharingButtonGroup from "./SocialSharingButtonGroup";

function ProductDetailPage() {
  const theme = useTheme();
  const { xsAndDown, smAndDown, sm, smAndUp, mdAndUp } = useContext(BreakpointsContext);
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);
  const params = useParams();
  const productId = parseInt(params.id!);
  const getProductQuery = useMemo<GetProductQuery>(() => ({ productId }), [productId]);
  const getProductResult = useGetProductQuery(getProductQuery, { skip: isNaN(productId) });

  const handleAddToCartButtonClick = () => {
    if (smAndDown) {
      setAttributeDialogOpen(true);
    }
  };

  useEffect(() => {
    if (mdAndUp) {
      setAttributeDialogOpen(false);
    }
  }, [mdAndUp]);

  const product = getProductResult.currentData;

  const ProductTitle = <Typography variant="h3">{product ? product.name : <Skeleton variant="text" width="80%" />}</Typography>;

  const ProductPrice = (
    <Box>
      {product
        ? <>
          <Typography variant="h5" color="primary" fontWeight={700}>{toVndCurrency(product.discountPrice)}</Typography>
          <Typography variant="body1" color="textDisabled" sx={{ textDecorationLine: "line-through", display: "inline" }}>{toVndCurrency(product.price)}</Typography>
          <Typography component="sup" color="error" variant="caption"> -{product.discountPercentage}%</Typography>
        </>
        : <Typography variant="h5"><Skeleton variant="text" width={100} /></Typography>}
    </Box>
  );

  const ProductRating = (
    <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "flex-end" }}>
      {product
        ? <>
          <Rating defaultValue={3.3} readOnly />
          <Typography variant="subtitle2" component="p" align="right">(3.3) 1k Reviews</Typography>
        </>
        : <>
          <Skeleton variant="rounded" width={120} height={24} />
          <Typography variant="subtitle2" align="right"><Skeleton variant="text" width={100} /></Typography>
        </>}
    </Stack>
  );

  const AddToCartButton = (
    product
      ? (
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
      )
      : (
        <Skeleton
          variant="rounded"
          sx={{
            width: "100%",
            height: 42,
            maxWidth: 500,
            mt: 4,
            mx: "auto",
          }}
        />
      )
  );

  const QuantityInput = (
    product
      ? (
        <NumberSpinner
          min={1}
          defaultValue={1}
          size="small"
          sx={{
            maxWidth: 200,
            width: "100%",
            alignSelf: "flex-end",
            mt: 4,
          }}
        />
      )
      : (
        <Skeleton
          variant="rounded"
          sx={{
            maxWidth: 200,
            width: "100%",
            height: 40,
            alignSelf: "flex-end",
            mt: 4,
          }}
        />
      )
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
                <ProductBrandLink brandId={product ? product.brandId : undefined} />
                {xsAndDown && ProductPrice}
              </Box>
              <Box sx={{ flex: 1 }} />
              {ProductRating}
            </Stack>
          </Box>}
          {xsAndDown && <SocialSharingButtonGroup />}
          <ImageCarousel {...(product && {
            defaultIndex: product.images.findIndex((i) => i.filePath === product.thumbnailPath),
            images: product.images,
          })}
          />
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
            {product && <ProductVariantSelectorDialog
              open={attributeDialogOpen}
              variants={product.productVariants}
              confirmButtonText="Add to cart"
              onClose={() => setAttributeDialogOpen(false)}
            />}
          </>}
        </Box>
        {/* right */}
        {mdAndUp && <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
          {ProductTitle}
          <ProductBrandLink brandId={product ? product.brandId : undefined} />
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
            {ProductPrice}
            {ProductRating}
          </Box>
          <Divider sx={{ my: 1 }} />
          <ProductVariantSelector variants={product ? product.productVariants : undefined} />
          {QuantityInput}
          {AddToCartButton}
        </Box>}
      </Box>
      <RelatedProducts />
      <ProductDescription loading={!product} />
    </LayoutContainer>
  );
}

export default ProductDetailPage;
