import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { JSX, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, To } from "react-router-dom";
import SidebarContext from "./SidebarContext";

export type SidebarTab = {
  title: string;
  to?: To;
  icon?: JSX.Element;
  children?: SidebarTab[];
  hashPath: string;
};

type SidebarItemProps = {
  sidebarTab: SidebarTab;
  level?: number;
  hideChilds?: boolean;
};

export default function SidebarItem({ sidebarTab, level = 0, hideChilds }: SidebarItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { currentSidebarTab } = useContext(SidebarContext);
  const [leftPadding] = useState<number>(theme.constants.sidebarLeftPadding || 0);
  // const fullyMatch = currentSidebarTab === sidebarTab;
  const partialMatch = !!currentSidebarTab && currentSidebarTab.hashPath.startsWith(sidebarTab.hashPath);
  const [open, setOpen] = useState<boolean>(!!partialMatch);

  const handleClickItem = () => {
    setOpen(!open);
    window.scrollTo({ top: 0 });
  };

  const handleClickExpandIcon: React.MouseEventHandler<SVGSVGElement> = (event) => {
    // collapse child without open the link
    event.preventDefault();
    setOpen(!open);
  };

  return (
    <>
      <ListItem>
        <ListItemButton
          {...(sidebarTab.to && {
            component: Link,
            to: sidebarTab.to,
          })}
          selected={!!partialMatch}
          style={{ paddingLeft: leftPadding + (level * theme.constants.scalingFactor) }}
          onClick={handleClickItem}>
          {sidebarTab.icon && <ListItemIcon>
            {sidebarTab.icon}
          </ListItemIcon>}
          <ListItemText primary={t(sidebarTab.title)} />
          {sidebarTab.children && sidebarTab.children.length !== 0 && <ExpandMoreIcon
            sx={{
              transform: open ? "rotate(180deg)" : undefined,
              transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.short,
                easing: theme.transitions.easing.sharp,
              }),
              "&:hover": {
                color: theme.palette.primary.main,
              },
            }}
            onClick={handleClickExpandIcon}
          />}
        </ListItemButton>
      </ListItem>
      {sidebarTab.children && sidebarTab.children.length !== 0 && <Collapse in={open && !hideChilds} unmountOnExit>
        <List disablePadding dense>
          {sidebarTab.children.map((child) => <SidebarItem key={child.title} sidebarTab={child} level={level + 1} hideChilds={hideChilds} />)}
        </List>
      </Collapse>}
    </>
  );
}
