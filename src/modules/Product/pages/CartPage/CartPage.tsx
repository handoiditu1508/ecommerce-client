import { toVndCurrency } from "@/common/formats";
import { mdAndUpMediaQuery, smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import LayoutContainer from "@/layouts/ClientLayout/LayoutContainer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import CartItem from "./CartItem";

const cartSummaryWidth = 400;
function CartPage() {
  const theme = useTheme();

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
            <Typography variant="h5">3 Items</Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <CartItem />
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
          <Typography variant="body1">{toVndCurrency(480000)}</Typography>
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
        <Button color="secondary" sx={{ mt: 1 }}>Apply</Button>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <Typography variant="body1">Total</Typography>
          <Typography variant="body1">{toVndCurrency(490000)}</Typography>
        </Box>
        <Button color="primary" fullWidth sx={{ mt: 1 }}>Checkout</Button>
      </Paper>
    </LayoutContainer>
  );
}

export default CartPage;
