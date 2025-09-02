import FaSvgIcon from "@/components/FaSvgIcon";
import MdiSvgIcon from "@/components/MdiSvgIcon";
import { BreakpointsContext } from "@/contexts/breakpoints";
import { InfoContext } from "@/contexts/info";
import { faHandFist } from "@fortawesome/free-solid-svg-icons/faHandFist";
import { faSkull } from "@fortawesome/free-solid-svg-icons/faSkull";
import { mdiShieldSword } from "@mdi/js";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import FlareIcon from "@mui/icons-material/Flare";
import ForestIcon from "@mui/icons-material/Forest";
import GrassIcon from "@mui/icons-material/Grass";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ParkIcon from "@mui/icons-material/Park";
import PetsIcon from "@mui/icons-material/Pets";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
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

function convertTemporaryToSidebarTab(temporary: TemporarySidebarTab, index: number = 0, parentHashPath: string = "/"): SidebarTab {
  const hashPath = parentHashPath.endsWith("/") ? `${parentHashPath}${index}/` : `${parentHashPath}/${index}/`;

  const sidebarTab: SidebarTab = {
    ...temporary,
    children: temporary.children ? temporary.children.map((t, i) => convertTemporaryToSidebarTab(t, i + 1, hashPath)) : [],
    hashPath,
  };

  flatSidebarTabs.push(sidebarTab);

  return sidebarTab;
}

const temporarySidebarTabs: TemporarySidebarTab[][] = [
  [
    {
      title: "Nature",
      to: "/nature",
      icon: <GrassIcon />,
      children: [
        {
          title: "Lone Ranger",
          to: "/nature/solo",
          icon: <ParkIcon />,
        },
        {
          title: "Guild",
          to: "/nature/guild",
          icon: <ForestIcon />,
        },
        {
          title: "Wild",
          to: "/wild",
          icon: <PetsIcon />,
        },
      ],
    },
    {
      title: "Fire",
      to: "/fire",
      icon: <LocalFireDepartmentIcon />,
    },
    {
      title: "Water",
      to: "/water",
      icon: <WaterDropIcon />,
      children: [
        {
          title: "Ice",
          to: "/ice",
          icon: <AcUnitIcon />,
        },
      ],
    },
    {
      title: "Electricity",
      to: "/electricity",
      icon: <ElectricBoltIcon />,
    },
    {
      title: "Air",
      to: "/air",
      icon: <AirIcon />,
    },
    {
      title: "Earth",
      to: "/earth",
      icon: <LandscapeIcon />,
    },
    {
      title: "Light",
      to: "/light",
      icon: <FlareIcon />,
    },
    {
      title: "Shadow",
      to: "/shadow",
      icon: <DarkModeIcon />,
    },
    {
      title: "Magic",
      to: "/magic",
      icon: <AutoFixHighIcon />,
      children: [
        {
          title: "Necromancy",
          to: "/magic/necromancy",
          icon: <FaSvgIcon icon={faSkull} />,
        },
      ],
    },
    {
      title: "Physical",
      to: "/physical",
      icon: <FaSvgIcon icon={faHandFist} />,
      children: [
        {
          title: "Knight",
          to: "/physics/knight",
          icon: <MdiSvgIcon path={mdiShieldSword} />,
        },
      ],
    },
  ],
  [
    {
      title: "Privacy Policy",
      to: "/privacy-policy",
    },
  ],
];

const sidebarTabs: SidebarTab[][] = temporarySidebarTabs.map((tempArr, Arrindex) => tempArr.map((value, index) => convertTemporaryToSidebarTab(value, index, Arrindex.toString())));

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
    const sidebarTab = flatSidebarTabs.find((sidebarTab) => sidebarTab.to === location.pathname);
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
