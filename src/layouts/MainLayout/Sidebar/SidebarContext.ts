import { SwipeableDrawerProps } from "@mui/material";
import React from "react";
import { SidebarTab } from "./SidebarItem";

export type SidebarState = "hidden" | "temporary" | "mini" | "permanent" | "miniHovered";

export type CustomTransition = (...props: string[]) => React.CSSProperties["transition"];

export type SidebarContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  sidebarCurrentWidth: number;// number of pixels sidebar is using permanently
  sidebarPinned: boolean;
  setSidebarPinned: (sidebarPinned: boolean) => void;
  sidebarState: SidebarState;
  sidebarVariant: SwipeableDrawerProps["variant"];
  miniSidebarTransition: CustomTransition;
  permanentSidebarTransition: CustomTransition;
  sidebarHovered: boolean;
  setSidebarHovered: (sidebarHovered: boolean) => void;
  sidebarTabs: SidebarTab[][];
  currentSidebarTab?: SidebarTab | null;
};
const SidebarContext = React.createContext<SidebarContextType>({} as SidebarContextType);

export default SidebarContext;
