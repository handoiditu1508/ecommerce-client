import { BreakpointsContext } from "@/contexts/breakpoints";
import useAppSelector from "@/hooks/useAppSelector";
import { cartSelectors } from "@/redux/slices/cartSlice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { useContext } from "react";
import { Link } from "react-router-dom";

export type CartButtonProps = IconButtonProps;

function CartButton(props: CartButtonProps) {
  const { mdAndUp } = useContext(BreakpointsContext);
  const cartTotalItems = useAppSelector(cartSelectors.totalItems);

  return (
    <IconButton component={Link} to="/cart" {...props}>
      <Badge
        badgeContent={cartTotalItems}
        color="primary"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: mdAndUp ? "right" : "left",
        }}
      >
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}

export default CartButton;
