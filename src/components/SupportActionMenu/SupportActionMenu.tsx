import SupportAction from "@/models/SupportAction";
import { Divider, Menu, MenuItemProps, MenuProps } from "@mui/material";
import SupportActionMenuItem from "./SupportActionMenuItem";

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
