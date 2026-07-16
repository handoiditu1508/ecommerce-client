import Divider from "@mui/material/Divider";
import Menu, { MenuProps } from "@mui/material/Menu";
import { MenuItemProps } from "@mui/material/MenuItem";
import SupportActionMenuItem from "./SupportActionMenuItem";
import { SupportAction } from "./models";

type OwnProps = {
  supportActions: SupportAction[];
  menuItemProps?: MenuItemProps;
};

type SupportActionMenuProps = OwnProps & Omit<MenuProps, keyof OwnProps>;

function SupportActionMenu({ supportActions, menuItemProps, ...props }: SupportActionMenuProps) {
  return (
    <Menu {...props}>
      {supportActions.map((supportAction) => ([
        <SupportActionMenuItem key={supportAction.id} supportAction={supportAction} {...menuItemProps} />,
        (supportAction.bottomDivider && <Divider />),
      ]))}
    </Menu>
  );
}

export default SupportActionMenu;
