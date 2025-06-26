import { BreakpointsContext } from "@/contexts/breakpoints";
import { useTheme } from "@mui/material";
import { ProviderProps, useContext, useEffect, useState } from "react";
import HeaderContext, { HeaderContextType } from "./HeaderContext";

type HeaderProviderProps = Omit<ProviderProps<HeaderContextType>, "value">;

function HeaderProvider(props: HeaderProviderProps) {
  const theme = useTheme();
  const { xs, lgAndUp } = useContext(BreakpointsContext);
  const [headerHeight, setHeaderHeight] = useState<number>((xs ? theme.constants.xsHeaderHeight : theme.constants.headerHeight) || 0);
  const [headerTopSpacing, setHeaderTopSpacing] = useState<number>(lgAndUp ? theme.constants.scalingFactor * 2 : 0);
  const [headerClientHeight, setHeaderClientHeight] = useState<number>(headerHeight + headerTopSpacing);
  document.body.style.setProperty("--header-top-spacing", `${headerTopSpacing}px`);
  document.body.style.setProperty("--header-height", `${headerHeight}px`);
  document.body.style.setProperty("--header-client-height", `${headerHeight + headerTopSpacing}px`);

  useEffect(() => {
    const height: number = (xs ? theme.constants.xsHeaderHeight : theme.constants.headerHeight) || 0;
    setHeaderHeight(height);
    setHeaderClientHeight(height + headerTopSpacing);
    document.body.style.setProperty("--header-height", `${height}px`);
  }, [xs, headerTopSpacing, theme]);

  useEffect(() => {
    const newValue: number = lgAndUp ? theme.constants.scalingFactor * 2 : 0;
    setHeaderTopSpacing(newValue);
    document.body.style.setProperty("--header-top-spacing", `${newValue}px`);
  }, [lgAndUp, theme]);

  useEffect(() => {
    document.body.style.setProperty("--header-client-height", `${headerHeight + headerTopSpacing}px`);
  }, [headerHeight, headerTopSpacing]);

  return <HeaderContext.Provider value={{ headerHeight, headerTopSpacing, headerClientHeight }} {...props} />;
}

export default HeaderProvider;
