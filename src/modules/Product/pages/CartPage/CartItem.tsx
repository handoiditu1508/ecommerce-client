import { toVndCurrency } from "@/common/formats";
import NumberSpinner from "@/components/NumberSpinner";
import { BreakpointsContext, xsAndDownMediaQuery } from "@/contexts/breakpoints";
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
import ProductAttributesEditButton from "./ProductAttributesEditButton";

const cartImageSize = 160;
const cartImageSizeXs = 80;
const checkboxSize = 38;

function CartItem() {
  const theme = useTheme();
  const { xsAndDown, smAndUp } = useContext(BreakpointsContext);
  const productTitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id nisi facilisis, rhoncus ex quis, molestie orci. Sed ullamcorper porttitor magna, vulputate semper metus tincidunt porta.";

  const TotalPriceText = (
    <Typography variant="body1" color="primary" fontWeight={500}>{toVndCurrency(160000)}</Typography>
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
        }}>
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
          image="https://placehold.co/600x400"
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
            <Tooltip title={productTitle} arrow>
              <Typography
                variant="body1"
                fontWeight={700}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis">
                {productTitle}
              </Typography>
            </Tooltip>
            {smAndUp && TotalPriceText}
          </Box>
          <Typography variant="body2">{toVndCurrency(80000)}</Typography>
          <ProductAttributesEditButton />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <NumberSpinner
              defaultValue={1}
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
