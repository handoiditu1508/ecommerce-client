import React from "react";

export type BreakpointsContextType = {
  xs: boolean;
  xsAndUp: boolean;
  smAndDown: boolean;
  sm: boolean;
  smAndUp: boolean;
  mdAndDown: boolean;
  md: boolean;
  mdAndUp: boolean;
  lgAndDown: boolean;
  lg: boolean;
  lgAndUp: boolean;
  // xl: boolean;
  // xlAndUp: boolean;
};

const BreakpointsContext = React.createContext<BreakpointsContextType>({} as BreakpointsContextType);

export default BreakpointsContext;
