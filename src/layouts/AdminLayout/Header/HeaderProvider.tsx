import { BreakpointsContext } from "@/contexts/breakpoints";
import { useTheme } from "@mui/material/styles";
import { ProviderProps, useContext, useEffect, useState } from "react";
import HeaderContext, { HeaderContextType } from "./HeaderContext";

type HeaderProviderProps = Omit<ProviderProps<HeaderContextType>, "value">;

function HeaderProvider(props: HeaderProviderProps) {
  const theme = useTheme();
  const { xsAndDown, lgAndUp } = useContext(BreakpointsContext);
  const [headerHeight, setHeaderHeight] = useState<number>((xsAndDown ? theme.constants.xsHeaderHeight : theme.constants.headerHeight) || 0);
  const [headerTopSpacing, setHeaderTopSpacing] = useState<number>(lgAndUp ? theme.constants.scalingFactor * 2 : 0);
  const [headerClientHeight, setHeaderClientHeight] = useState<number>(headerHeight + headerTopSpacing);
  document.body.style.setProperty("--header-top-spacing", `${headerTopSpacing}px`);
  document.body.style.setProperty("--header-height", `${headerHeight}px`);
  document.body.style.setProperty("--header-client-height", `${headerHeight + headerTopSpacing}px`);

  useEffect(() => {
    const height: number = (xsAndDown ? theme.constants.xsHeaderHeight : theme.constants.headerHeight) || 0;
    setHeaderHeight(height);
  }, [xsAndDown, theme]);

  useEffect(() => {
    const newValue: number = lgAndUp ? theme.constants.scalingFactor * 2 : 0;
    setHeaderTopSpacing(newValue);
  }, [lgAndUp, theme]);

  useEffect(() => {
    setHeaderClientHeight(headerHeight + headerTopSpacing);
  }, [headerHeight, headerTopSpacing]);

  return <HeaderContext.Provider value={{ headerHeight, headerTopSpacing, headerClientHeight }} {...props} />;
}

export default HeaderProvider;
