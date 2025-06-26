import logo from "@/assets/logo.svg";
import CustomButton from "@/components/CustomButton";
import CONFIG from "@/configs";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { InfoContext } from "@/contexts/info";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, useTheme } from "@mui/material";
import React, { Fragment, useContext, useState } from "react";
import SidebarContext from "./SidebarContext";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  const theme = useTheme();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarVariant,
    sidebarState,
    miniSidebarTransition,
    permanentSidebarTransition,
    setSidebarHovered,
    sidebarPinned,
    setSidebarPinned,
    sidebarTabs,
  } = useContext(SidebarContext);
  const { smAndDown } = useContext(BreakpointsContext);
  const toggleDrawer = (val: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => setSidebarOpen(val);
  const [miniSidebarWidth] = useState<number>(theme.constants.miniSidebarWidth || 0);
  /**
   * iOS is hosted on high-end devices. The backdrop transition can be enabled without dropping frames. The performance will be good enough.
   * iOS has a "swipe to go back" feature that interferes with the discovery feature, so discovery has to be disabled.
   */
  const { iOS, mobile } = useContext(InfoContext);

  // transform transition for SidebarItem's expand icon
  const transformTransition = theme.transitions.create("transform", {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.sharp,
  });
  const boxShadowTransition = theme.transitions.create("box-shadow", {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeOut,
  });

  return (
    <SwipeableDrawer
      open={sidebarOpen}
      anchor="left"
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      variant={sidebarVariant}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        width: sidebarState === "mini" ? miniSidebarWidth : undefined,
      }}
      PaperProps={{
        elevation: 4,
        sx: {
          ...(sidebarState === "mini" && {
            transition: `${miniSidebarTransition("width")}, ${boxShadowTransition}`,
            width: miniSidebarWidth,
          }),
          ...((sidebarState === "permanent" || sidebarState === "miniHovered") && {
            transition: `${permanentSidebarTransition("width")}, ${boxShadowTransition}`,
          }),
          ".MuiListItemText-root, .MuiListItemButton-root>.MuiSvgIcon-root": {
            opacity: sidebarState === "mini" ? 0 : undefined,
            transition: transformTransition,
            ...((sidebarState === "permanent" || sidebarState === "miniHovered") && {
              transition: `${permanentSidebarTransition("opacity")}, ${transformTransition}`,
            }),
            ...(sidebarState === "mini" && {
              transition: `${miniSidebarTransition("opacity")}, ${transformTransition}`,
            }),
          },
          boxShadow: sidebarState === "miniHovered" ? undefined : "none",
        },
        onMouseEnter: () => setSidebarHovered(true),
        onMouseLeave: () => setSidebarHovered(false),
      }}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <List>
        <ListItem sx={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <CustomButton
            variant="text"
            to="/"
            disableRipple
            disableTouchRipple
            sx={{
              paddingX: 0,
              marginLeft: `${(miniSidebarWidth - 40) / 2}px`,
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}>
            <ListItemIcon sx={{
              minWidth: "unset",
              marginRight: 1,
            }}>
              <img src={logo} alt="logo" width={40} height={40} />
            </ListItemIcon>
            <ListItemText
              primary={CONFIG.APP_NAME}
              slotProps={{
                primary: {
                  color: "primary",
                  variant: "h6",
                  textTransform: "none",
                },
              }}
            />
          </CustomButton>
          {!(smAndDown || mobile) && <IconButton
            color="primary"
            size="small"
            sx={{
              marginRight: 1,
              opacity: sidebarState === "mini" ? 0 : undefined,
              ...((sidebarState === "permanent" || sidebarState === "miniHovered") && {
                transition: theme.transitions.create("opacity", { delay: theme.transitions.duration.enteringScreen, duration: 0 }),
              }),
            }}
            onClick={() => setSidebarPinned(!sidebarPinned)}>
            {sidebarPinned ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>}
        </ListItem>
      </List>

      <List>
        {sidebarTabs.map((tabs, tabsIndex) => <Fragment key={tabsIndex}>
          {tabs.map((tab) => <SidebarItem key={tab.title} sidebarTab={tab} hideChilds={sidebarState === "mini"} />)}
          {(tabsIndex !== sidebarTabs.length - 1) && <Divider />}
        </Fragment>)}
      </List>
    </SwipeableDrawer>
  );
};

export default Sidebar;
