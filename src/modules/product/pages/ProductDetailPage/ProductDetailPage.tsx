import { toVndCurrency } from "@/common/format";
import NumberSpinner from "@/components/NumberSpinner";
import { BreakpointsContext, smAndDownMediaQuery } from "@/contexts/breakpoints";
import useAppDispatch from "@/hooks/useAppDispatch";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { GetProductQuery } from "@/models/apis/product/getProduct";
import Product, { ProductVariant } from "@/models/entities/Product";
import { useGetProductQuery } from "@/redux/apis/productApi";
import { addToCart } from "@/redux/slices/cartSlice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

const getDiscountValueText = (product: Product): string => {
  if (product.discountPercentage) return `-${product.discountPercentage}%`;

  if (product.price !== product.discountPrice) return toVndCurrency(product.discountPrice - product.price);

  return "";
};

function ProductDetailPage() {
  const theme = useTheme();
  const { t: tProduct } = useTranslation("product");
  const { xsAndDown, smAndDown, sm, smAndUp, mdAndUp } = useContext(BreakpointsContext);
  const dispatch = useAppDispatch();
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);
  const params = useParams();
  const productId = parseInt(params.id!);
  const getProductQuery = useMemo<GetProductQuery>(() => ({ productId }), [productId]);
  const getProductResult = useGetProductQuery(getProductQuery, { skip: isNaN(productId) });
  const product = getProductResult.currentData;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number>();
  const selectedVariant = useMemo<ProductVariant | undefined>(
    () => product && selectedVariantId ? product.productVariants.find((v) => v.id === selectedVariantId) : undefined,
    [product, selectedVariantId]
  );

  const handleAddToCartButtonClick = () => {
    if (smAndDown) {
      setAttributeDialogOpen(true);
    } else {
      if (product && selectedVariantId) {
        dispatch(addToCart({
          product,
          productVariantId: selectedVariantId,
          quantity,
        }));
      }
    }
  };

  useEffect(() => {
    if (mdAndUp) {
      setAttributeDialogOpen(false);
    }
  }, [mdAndUp]);

  const ProductTitle = <Typography variant="h3">{product ? product.name : <Skeleton variant="text" width="80%" />}</Typography>;

  const currentPrice = (selectedVariant && selectedVariant.discountPrice) || (product?.discountPrice ?? 0);
  const originalPrice = (selectedVariant && selectedVariant.price) || (product?.price ?? 0);
  const ProductPrice = (
    <Box>
      {product
        ? <>
          <Typography variant="h5" color="primary" fontWeight={700}>{toVndCurrency(currentPrice)}</Typography>
          {currentPrice !== originalPrice && <>
            <Typography
              variant="body1"
              color="textDisabled"
              sx={{ textDecorationLine: "line-through", display: "inline" }}
            >
              {toVndCurrency(originalPrice)}
            </Typography>
            <Typography component="sup" color="error" variant="caption"> {getDiscountValueText(product)}</Typography>
          </>}
        </>
        : <Typography variant="h5"><Skeleton variant="text" width={100} /></Typography>}
    </Box>
  );

  const ProductRating = (
    <Stack direction={{ xs: "row", md: "column" }} alignItems={{ xs: "center", md: "flex-end" }}>
      {product
        ? <>
          <Rating defaultValue={3.3} readOnly />
          <Typography variant="subtitle2" component="p" align="right">{tProduct("reviews_count", "", { rating: 3.3, total: "1k" })}</Typography>
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
          disabled={selectedVariantId === undefined}
          onClick={handleAddToCartButtonClick}>
          {tProduct("add_to_cart")}
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
          value={quantity}
          size="small"
          sx={{
            maxWidth: 200,
            width: "100%",
            alignSelf: "flex-end",
            mt: 4,
          }}
          onValueChange={(value) => setQuantity(value || 1)}
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
              confirmButtonText={tProduct("add_to_cart")}
              onChange={setSelectedVariantId}
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
          <ProductVariantSelector
            variants={product ? product.productVariants : undefined}
            onChange={setSelectedVariantId}
          />
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
