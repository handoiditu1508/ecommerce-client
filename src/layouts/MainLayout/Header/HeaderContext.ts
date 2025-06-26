import React from "react";

export type HeaderContextType = {
  headerHeight: number;
  headerTopSpacing: number;
  headerClientHeight: number;// headerHeight + headerTopSpacing + other spacings if any
};
const HeaderContext = React.createContext<HeaderContextType>({} as HeaderContextType);

export default HeaderContext;
