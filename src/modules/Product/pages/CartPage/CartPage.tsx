import { toVndCurrency } from "@/common/format";
import { mdAndUpMediaQuery, smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import { cartSelectors, refreshCartAsync, rehydrateCartAsync } from "@/redux/slices/cartSlice";
import { CartProductVariantData } from "@/redux/utils/cartUtils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Fragment, useEffect, useState } from "react";
import CartItem from "./CartItem";

const cartSummaryWidth = 400;
function CartPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isCartHydrated = useAppSelector(cartSelectors.hydrated);
  const cachedProductIds = useAppSelector(cartSelectors.cachedProductIds);
  const cartItemDatas = useAppSelector(cartSelectors.itemDatas);
  const totalVariantDatas = cartItemDatas.flatMap((d) => d.productVariants);
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<number, boolean>>({});
  const isAllSelected = totalVariantDatas.every((v) => selectedVariantIds[v.productVariantId]);
  const subtotal = totalVariantDatas
    .filter((v) => selectedVariantIds[v.productVariantId])
    .reduce((sumVariantData: number, variantData: CartProductVariantData) => sumVariantData + variantData.totalPrice, 0);
  const shippingFee = 10000;
  const promoCodeDiscount = 0;
  const total = subtotal + shippingFee + promoCodeDiscount;

  useEffect(() => {
    if (!isCartHydrated) {
      dispatch(rehydrateCartAsync());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartHydrated]);

  useEffect(() => {
    if (isCartHydrated && cachedProductIds.length) {
      dispatch(refreshCartAsync());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartHydrated, cachedProductIds]);

  const handleSelectCartItem = (productVariantId: number, checked: boolean) => {
    if (!!selectedVariantIds[productVariantId] !== checked) {
      setSelectedVariantIds({
        ...selectedVariantIds,
        [productVariantId]: checked,
      });
    }
  };

  const handleToggleSelectAll = (checked: boolean) => {
    const result: Record<number, boolean> = {};
    if (checked) {
      for (const variantData of totalVariantDatas) {
        result[variantData.productVariantId] = true;
      }
    }
    setSelectedVariantIds(result);
  };

  return (
    <LayoutContainer
      // disableGutters={false}
      sx={{
        display: "flex",
        flex: 1,
        position: "relative",
        [smAndDownMediaQuery(theme.breakpoints)]: {
          flexDirection: "column",
        },
      }}>
      {/* left */}
      <Box sx={{
        flex: 1,
        [mdAndUpMediaQuery(theme.breakpoints)]: {
          maxWidth: `calc(100% - ${cartSummaryWidth}px)`,
          boxSizing: "border-box",
        },
        padding: theme.spacing(4, 2, 2),
        [xsAndDownMediaQuery(theme.breakpoints)]: {
          px: 0,
        },
      }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
        }}>
          <Checkbox
            size="small"
            slotProps={{
              input: {
                "aria-label": "Select all",
              },
            }}
            checked={isAllSelected}
            onChange={(_event, checked) => handleToggleSelectAll(checked)}
          />
          <Box sx={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            [xsAndDownMediaQuery(theme.breakpoints)]: {
              flexDirection: "column",
              alignItems: "flex-start",
            },
          }}>
            <Typography variant="h4">Shopping Cart</Typography>
            <Typography variant="h5">{totalVariantDatas.length} Items</Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Stack gap={1}>
          {isCartHydrated
            ? (
              cartItemDatas.map((d) => <Fragment key={d.productId}>
                {d.productVariants.map((v) => <CartItem
                  key={v.productVariantId}
                  cartData={d}
                  variantData={v}
                  checked={selectedVariantIds[v.productVariantId]}
                  onToggleSelect={(checked) => handleSelectCartItem(v.productVariantId, checked)}
                />)}
              </Fragment>)
            )
            : (
              [...Array(3)].map((_, index) => <CartItem key={index} />)
            )}
        </Stack>
      </Box>
      {/* right */}
      <Paper
        variant="outlined"
        square
        sx={{
          padding: theme.spacing(4, 2, 2),
          boxSizing: "border-box",
          borderTop: "none",
          borderBottom: "none",
          [mdAndUpMediaQuery(theme.breakpoints)]: {
            width: cartSummaryWidth,
            position: "absolute",
            top: 0,
            right: 0,
            height: `calc(var(--body-content-height) + ${theme.spacing(10)})`, // to cover the footer margin top
          },
          [smAndDownMediaQuery(theme.breakpoints)]: {
            width: "100%",
          },
        }}>
        <Typography variant="h4">Summary</Typography>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <Typography variant="body1">Subtotal</Typography>
          <Typography variant="body1">{toVndCurrency(subtotal)}</Typography>
        </Box>
        <Box sx={{
          mt: 1,
        }}>
          <Typography variant="body2" component="label">Shipping</Typography>
          <Select fullWidth size="small" defaultValue={1}>
            <MenuItem value={1}>Standard - {toVndCurrency(10000)}</MenuItem>
            <MenuItem value={2}>Express - {toVndCurrency(20000)}</MenuItem>
          </Select>
        </Box>
        <Box sx={{
          mt: 1,
        }}>
          <Typography variant="body2" component="label">Promo code</Typography>
          <OutlinedInput fullWidth size="small" placeholder="Enter your promocode" />
        </Box>
        <Button color="secondary" sx={{ mt: 1 }} disabled={!isCartHydrated}>Apply</Button>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <Typography variant="body1">Total</Typography>
          <Typography variant="body1">{toVndCurrency(total)}</Typography>
        </Box>
        <Button color="primary" fullWidth sx={{ mt: 1 }} disabled={!isCartHydrated}>Checkout</Button>
      </Paper>
    </LayoutContainer>
  );
}

export default CartPage;
