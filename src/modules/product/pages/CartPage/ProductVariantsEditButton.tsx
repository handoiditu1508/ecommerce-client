import { smAndUpMediaQuery } from "@/contexts/breakpoints";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { cartSelectors, changeProductVariantInCart } from "@/redux/slices/cartSlice";
import { CartItemData, CartProductVariantData } from "@/redux/utils/cartUtils";
import EditIcon from "@mui/icons-material/Edit";
import ButtonBase from "@mui/material/ButtonBase";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ProductVariantSelectorDialog from "../../components/ProductVariantSelectorDialog";

export type ProductVariantsEditButtonProps = {
  cartData: CartItemData;
  variantData: CartProductVariantData;
};

function ProductVariantsEditButton({ cartData, variantData }: ProductVariantsEditButtonProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [attributeDialogOpen, setAttributeDialogOpen] = useState(false);
  const product = useAppSelector(cartSelectors.cachedProduct(cartData.productId));

  const handleClickEditAttributes = () => {
    if (product) {
      setAttributeDialogOpen(true);
    }
  };

  return (
    <>
      <ButtonBase
        sx={{
          color: theme.vars.palette.primary.contrastText,
          display: "flex",
          alignItems: "center",
          width: "fit-content",
          maxWidth: "100%",
          borderRadius: 1,
          backgroundColor: theme.vars.palette.primary.main,
          px: 0.5,
          gap: 0.5,
          [smAndUpMediaQuery(theme.breakpoints)]: {
            mt: 1,
          },
        }}
        onClick={handleClickEditAttributes}>
        <Typography
          variant="caption"
          color="inherit"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis">
          {variantData.productVariantName}
        </Typography>
        <EditIcon color="inherit" fontSize="inherit" />
      </ButtonBase>
      {product && <ProductVariantSelectorDialog
        open={attributeDialogOpen}
        confirmButtonText="Save"
        variants={product.productVariants}
        defaultVariantId={variantData.productVariantId}
        onChange={(nextProductVariantId) => dispatch(changeProductVariantInCart({
          product,
          prevProductVariantId: variantData.productVariantId,
          nextProductVariantId,
        }))}
        onClose={() => setAttributeDialogOpen(false)}
      />}
    </>
  );
}

export default ProductVariantsEditButton;
