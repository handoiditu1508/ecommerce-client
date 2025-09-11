import { BreakpointsContext } from "@/contexts/breakpoints";
import { useTheme } from "@mui/material/styles";
import { ProviderProps, useContext, useEffect, useState } from "react";
import HeaderContext, { HeaderContextType } from "./HeaderContext";

type HeaderProviderProps = Omit<ProviderProps<HeaderContextType>, "value">;

function HeaderProvider(props: HeaderProviderProps) {
  const theme = useTheme();
  const { xsAndDown, mdAndUp } = useContext(BreakpointsContext);
  const [headerHeight, setHeaderHeight] = useState<number>((xsAndDown ? theme.constants.xsHeaderHeight : theme.constants.headerHeight) || 0);
  const [topHeaderHeight, setTopHeaderHeight] = useState<number>(mdAndUp ? theme.constants.topHeaderHeight : 0);
  const [bottomHeaderHeight, setBottomHeaderHeight] = useState<number>(mdAndUp ? theme.constants.headerHeight : 0);
  const [headerClientHeight, setHeaderClientHeight] = useState<number>(headerHeight + topHeaderHeight);
  document.body.style.setProperty("--top-header-height", `${topHeaderHeight}px`);
  document.body.style.setProperty("--bottom-header-height", `${bottomHeaderHeight}px`);
  document.body.style.setProperty("--header-height", `${headerHeight}px`);
  document.body.style.setProperty("--header-client-height", `${headerHeight + topHeaderHeight + bottomHeaderHeight}px`);

  useEffect(() => {
    const height: number = (xsAndDown ? theme.constants.xsHeaderHeight : theme.constants.headerHeight) || 0;
    setHeaderHeight(height);
  }, [xsAndDown, theme]);

  useEffect(() => {
    const newTopValue: number = mdAndUp ? theme.constants.topHeaderHeight : 0;
    setTopHeaderHeight(newTopValue);

    const newBottomValue: number = mdAndUp ? theme.constants.headerHeight : 0;
    setBottomHeaderHeight(newBottomValue);
  }, [mdAndUp, theme]);

  useEffect(() => {
    const newValue = headerHeight + topHeaderHeight + bottomHeaderHeight;
    setHeaderClientHeight(newValue);
  }, [headerHeight, topHeaderHeight, bottomHeaderHeight]);

  return <HeaderContext.Provider value={{ headerHeight, topHeaderHeight, bottomHeaderHeight, headerClientHeight }} {...props} />;
}

export default HeaderProvider;
