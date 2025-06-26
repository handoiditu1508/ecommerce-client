import { useMediaQuery, useTheme } from "@mui/material";
import { ProviderProps } from "react";
import BreakpointsContext, { BreakpointsContextType } from "./BreakpointsContext";
import { lgAndDownMediaQuery, lgAndUpMediaQuery, lgMediaQuery, mdAndDownMediaQuery, mdAndUpMediaQuery, mdMediaQuery, smAndDownMediaQuery, smAndUpMediaQuery, smMediaQuery, xsAndUpMediaQuery, xsMediaQuery } from "./breakpointsHelpers";

type BreakpointsProviderProps = Omit<ProviderProps<BreakpointsContextType>, "value">;

export default function BreakpointsProvider(props: BreakpointsProviderProps) {
  const theme = useTheme();

  return (
    <BreakpointsContext.Provider
      value={{
        xs: useMediaQuery(xsMediaQuery(theme.breakpoints)),
        xsAndUp: useMediaQuery(xsAndUpMediaQuery(theme.breakpoints)),
        smAndDown: useMediaQuery(smAndDownMediaQuery(theme.breakpoints)),
        sm: useMediaQuery(smMediaQuery(theme.breakpoints)),
        smAndUp: useMediaQuery(smAndUpMediaQuery(theme.breakpoints)),
        mdAndDown: useMediaQuery(mdAndDownMediaQuery(theme.breakpoints)),
        md: useMediaQuery(mdMediaQuery(theme.breakpoints)),
        mdAndUp: useMediaQuery(mdAndUpMediaQuery(theme.breakpoints)),
        lgAndDown: useMediaQuery(lgAndDownMediaQuery(theme.breakpoints)),
        lg: useMediaQuery(lgMediaQuery(theme.breakpoints)),
        lgAndUp: useMediaQuery(lgAndUpMediaQuery(theme.breakpoints)),
        // xl: useMediaQuery(xlMediaQuery(theme.breakpoints)),
        // xlAndUp: useMediaQuery(xlAndUpMediaQuery(theme.breakpoints)),
      }}
      {...props}
    />
  );
}
