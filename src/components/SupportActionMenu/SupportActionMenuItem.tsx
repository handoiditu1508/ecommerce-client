import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { SupportAction } from "./models";

type OwnProps = {
  supportAction: SupportAction;
};

type SupportActionMenuItemProps = OwnProps & Omit<MenuItemProps, keyof OwnProps>;

function SupportActionMenuItem({ supportAction, ...props }: SupportActionMenuItemProps) {
  return (
    <MenuItem disabled={supportAction.disabled} onClick={supportAction.actionHandler} {...props}>
      {supportAction.idleIcon && <ListItemIcon>{supportAction.idleIcon}</ListItemIcon>}
      <ListItemText>{supportAction.text}</ListItemText>
      {supportAction.secondaryText && <Typography variant="body2" color="textSecondary">{supportAction.secondaryText}</Typography>}
    </MenuItem>
  );
}

export default SupportActionMenuItem;
