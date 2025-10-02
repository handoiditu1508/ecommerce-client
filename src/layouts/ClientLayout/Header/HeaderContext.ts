import React from "react";

export type HeaderContextType = {
  headerHeight: number;
  topHeaderHeight: number;
  bottomHeaderHeight: number;
  headerClientHeight: number;// headerHeight + topHeaderHeight + bottomHeaderHeight + other spacings if any
};
const HeaderContext = React.createContext<HeaderContextType>({} as HeaderContextType);

export default HeaderContext;
