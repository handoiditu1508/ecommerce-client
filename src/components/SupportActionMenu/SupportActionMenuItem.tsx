import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { SupportAction } from "./models";

type OwnProps = {
  item: SupportAction;
};

type SupportActionMenuItemProps = OwnProps & Omit<MenuItemProps, keyof OwnProps>;

function SupportActionMenuItem({ item, ...props }: SupportActionMenuItemProps) {
  return (
    <MenuItem disabled={item.disabled} onClick={item.actionHandler} {...props}>
      {item.idleIcon && <ListItemIcon>{item.idleIcon}</ListItemIcon>}
      <ListItemText>{item.label}</ListItemText>
      {item.secondaryText && <Typography variant="body2" color="textSecondary">{item.secondaryText}</Typography>}
    </MenuItem>
  );
}

export default SupportActionMenuItem;
