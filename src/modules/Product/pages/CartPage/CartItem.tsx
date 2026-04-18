import { toVndCurrency } from "@/common/formats";
import NumberSpinner from "@/components/NumberSpinner";
import CONFIG from "@/configs";
import { BreakpointsContext, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { removeFromCart, selectCachedProductFromCart, setQuantityForCart } from "@/redux/slices/cartSlice";
import { CartItemData, CartProductVariantData } from "@/redux/utils/cartUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button, { buttonClasses } from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Checkbox from "@mui/material/Checkbox";
import { inputBaseClasses } from "@mui/material/InputBase";
import { useTheme } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import ProductVariantsEditButton from "./ProductVariantsEditButton";

const cartImageSize = 160;
const cartImageSizeXs = 80;
const checkboxSize = 38;

export type CartItemProps = {
  cartData: CartItemData;
  variantData: CartProductVariantData;
};

function CartItem({ cartData, variantData }: CartItemProps) {
  const theme = useTheme();
  const { xsAndDown, smAndUp } = useContext(BreakpointsContext);
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCachedProductFromCart(cartData.productId));

  const TotalPriceText = (
    <Typography variant="body1" color="primary" fontWeight={500}>{toVndCurrency(variantData.totalPrice)}</Typography>
  );

  const CartItemActions = (
    <CardActions sx={{
      p: 0,
      justifyContent: "flex-end",
    }}>
      <Button
        variant="text"
        color="inherit"
        startIcon={<DeleteIcon />}
        size="small"
        sx={{
          color: theme.vars.palette.grey[500],
        }}
        onClick={() => dispatch(removeFromCart({
          productId: cartData.productId,
          productVariantId: variantData.productVariantId,
        }))}>
        Remove
      </Button>
    </CardActions>
  );

  return (
    <Card
      sx={{
        py: 1,
        pr: 1,
        "--cart-image-size": `${cartImageSize}px`,
        [xsAndDownMediaQuery(theme.breakpoints)]: {
          "--cart-image-size": `${cartImageSizeXs}px`,
        },
      }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Checkbox size="small" />
        <CardMedia
          component="img"
          image={CONFIG.FILE_URL + variantData.thumbnailPath}
          alt="Product image"
          sx={{
            width: "var(--cart-image-size)",
            height: "var(--cart-image-size)",
            objectFit: "cover",
          }}
        />
        <CardContent sx={{
          p: 0,
          "&:last-child": {
            pb: 0,
          },
          ml: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "var(--cart-image-size)",
          boxSizing: "border-box",
          width: `calc(100% - ${checkboxSize}px - var(--cart-image-size) - ${theme.spacing(1)})`, // 1 for ml: 1
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Tooltip title={cartData.productName} arrow>
              <Typography
                variant="body1"
                fontWeight={700}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis">
                {cartData.productName}
              </Typography>
            </Tooltip>
            {smAndUp && TotalPriceText}
          </Box>
          <Typography variant="body2">{toVndCurrency(variantData.discountPrice)}</Typography>
          <ProductVariantsEditButton cartData={cartData} variantData={variantData} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <NumberSpinner
              value={variantData.quantity}
              min={0}
              sx={{
                maxWidth: 100,
                width: "100%",
                mt: 0.5,
                [`.${buttonClasses.root}`]: {
                  p: 0.5,
                  [`.${svgIconClasses.root}`]: {
                    width: 10,
                    height: 10,
                    fontSize: 10,
                  },
                },
                [`.${inputBaseClasses.root}`]: {
                  input: {
                    p: "4px 6px",
                    fontSize: "0.75rem",
                    height: 12,
                    lineHeight: 12,
                  },
                },
              }}
              onValueChange={(value) => dispatch(setQuantityForCart({
                product,
                productVariantId: variantData.productVariantId,
                quantity: value || 0,
              }))}
            />
            {xsAndDown && TotalPriceText}
          </Box>
          {smAndUp && <>
            <Box sx={{ flex: 1 }} />
            {CartItemActions}
          </>}
        </CardContent>
      </Box>
      {xsAndDown && CartItemActions}
    </Card>
  );
}

export default CartItem;
