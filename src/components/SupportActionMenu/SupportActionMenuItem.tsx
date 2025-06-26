import SupportAction from "@/models/SupportAction";
import { ListItemIcon, ListItemText, MenuItem, MenuItemProps, Typography, useTheme } from "@mui/material";

type OwnProps = {
  supportAction: SupportAction;
};

type SupportActionMenuItemProps = OwnProps & Omit<MenuItemProps, keyof OwnProps>;

function SupportActionMenuItem({ supportAction, ...props }: SupportActionMenuItemProps) {
  const theme = useTheme();

  return (
    <MenuItem disabled={supportAction.disabled} onClick={supportAction.actionHandler} {...props}>
      {supportAction.idleIcon && <ListItemIcon>{supportAction.idleIcon}</ListItemIcon>}
      <ListItemText>{supportAction.text}</ListItemText>
      {supportAction.secondaryText && <Typography variant="body2" color={theme.palette.text.secondary}>{supportAction.secondaryText}</Typography>}
    </MenuItem>
  );
}

export default SupportActionMenuItem;
