import { BreakpointsContext } from "@/contexts/breakpoints";
import { InfoContext } from "@/contexts/info";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useTheme } from "@mui/material/styles";
import { SwipeableDrawerProps } from "@mui/material/SwipeableDrawer";
import { ProviderProps, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarContext, { SidebarContextType, SidebarState } from "./SidebarContext";
import { SidebarTab } from "./SidebarItem";

type TemporarySidebarTab = Pick<SidebarTab, "title" | "to" | "icon"> & {
  children?: TemporarySidebarTab[];
};

const flatSidebarTabs: SidebarTab[] = [];

function convertTemporaryToSidebarTab(
  temporary: TemporarySidebarTab,
  index: number = 0,
  parentHashPath: string = "/"
): SidebarTab {
  const hashPath = parentHashPath.endsWith("/") ? `${parentHashPath}${index}/` : `${parentHashPath}/${index}/`;

  const sidebarTab: SidebarTab = {
    ...temporary,
    children: temporary.children
      ? temporary.children.map((t, i) => convertTemporaryToSidebarTab(t, i + 1, hashPath))
      : [],
    hashPath,
  };

  flatSidebarTabs.push(sidebarTab);

  return sidebarTab;
}

const temporarySidebarTabs: TemporarySidebarTab[][] = [
  [
    {
      title: "products",
      to: "/admin/products",
      icon: <Inventory2Icon />,
      children: [
        {
          title: "create_product",
          to: "/admin/products/new",
          icon: <AddShoppingCartIcon />,
        },
      ],
    },
    {
      title: "users",
      to: "/admin/users",
      icon: <PeopleIcon />,
      children: [
        {
          title: "create_user",
          to: "/admin/users/new",
          icon: <PersonAddIcon />,
        },
      ],
    },
  ],
];

const sidebarTabs: SidebarTab[][] = temporarySidebarTabs.map((tempArr, arrayIndex) => tempArr.map(
  (value, index) => convertTemporaryToSidebarTab(value, index, arrayIndex.toString())
));

type SidebarProviderProps = Omit<ProviderProps<SidebarContextType>, "value">;

function SidebarProvider(props: SidebarProviderProps) {
  const theme = useTheme();
  const location = useLocation();
  const [sidebarWidth] = useState<number>(theme.constants.sidebarWidth);
  const { lgAndUp } = useContext(BreakpointsContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [miniSidebarWidth] = useState<number>(theme.constants.miniSidebarWidth);
  const [sidebarVariant, setSidebarVariant] = useState<SwipeableDrawerProps["variant"]>();
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const { mobile } = useContext(InfoContext);
  const displayAsDesktop = lgAndUp && !mobile;
  const sidebarState: SidebarState = displayAsDesktop
    ? sidebarPinned
      ? "permanent"
      : sidebarHovered ? "miniHovered" : "mini"
    : sidebarOpen ? "temporary" : "hidden";
  const sidebarCurrentWidth: number = displayAsDesktop
    ? (sidebarPinned ? sidebarWidth : miniSidebarWidth)
    : 0;
  document.body.style.setProperty("--sidebar-current-width", `${sidebarCurrentWidth}px`);
  const [currentSidebarTab, setCurrentSidebarTab] = useState<SidebarTab | undefined | null>(undefined);

  const setSidebarOpenWrapper = (value: boolean) => {
    // can not close sidebar on lgAndUp breakpoint
    if (!displayAsDesktop) {
      setSidebarOpen(value);
    }
  };

  useEffect(() => {
    // sidebar always show on lgAndUp breakpoint
    setSidebarOpen(displayAsDesktop);

    const variant: SwipeableDrawerProps["variant"] = displayAsDesktop ? "permanent" : "temporary";
    setSidebarVariant(variant);
  }, [displayAsDesktop]);

  useEffect(() => {
    const sidebarTab = flatSidebarTabs.find((sidebarTab) => sidebarTab.to === location.pathname)
      ?? flatSidebarTabs.find((sidebarTab) => typeof sidebarTab.to === "string" && location.pathname.startsWith(`${sidebarTab.to}/`));
    setCurrentSidebarTab(sidebarTab);
  }, [location]);

  const miniSidebarTransition = (...props: string[]) => theme.transitions.create(props, {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
    delay: theme.transitions.duration.shorter,
  });
  const permanentSidebarTransition = (...props: string[]) => theme.transitions.create(props, {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
    delay: theme.transitions.duration.shorter,
  });

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen: setSidebarOpenWrapper,
        sidebarCurrentWidth,
        sidebarPinned,
        setSidebarPinned,
        sidebarState,
        sidebarVariant,
        miniSidebarTransition,
        permanentSidebarTransition,
        sidebarHovered,
        setSidebarHovered,
        sidebarTabs,
        currentSidebarTab,
      }}
      {...props}
    />
  );
}

export default SidebarProvider;
