import React from "react";

export type InfoContextType = {
  iOS: boolean;
  mobile: boolean;
  mac: boolean;
  windowWidth: number;
  windowHeight: number;
  windowScrollX: number;
  windowScrollY: number;
};

const InfoContext = React.createContext<InfoContextType>({} as InfoContextType);

export default InfoContext;
