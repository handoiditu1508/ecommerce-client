import Divider from "@mui/material/Divider";
import Menu, { MenuProps } from "@mui/material/Menu";
import { MenuItemProps } from "@mui/material/MenuItem";
import SupportActionMenuItem from "./SupportActionMenuItem";
import { SupportAction } from "./models";

type OwnProps = {
  items: SupportAction[];
  menuItemProps?: MenuItemProps;
};

type SupportActionMenuProps = OwnProps & Omit<MenuProps, keyof OwnProps>;

function SupportActionMenu({ items, menuItemProps, ...props }: SupportActionMenuProps) {
  return (
    <Menu {...props}>
      {items.map((item) => ([
        <SupportActionMenuItem key={item.key} item={item} {...menuItemProps} />,
        (item.bottomDivider && <Divider key={`${item.key}-divider`} />),
      ]))}
    </Menu>
  );
}

export default SupportActionMenu;
