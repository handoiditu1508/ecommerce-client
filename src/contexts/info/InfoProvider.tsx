import { ProviderProps, useEffect, useState } from "react";
import InfoContext, { InfoContextType } from "./InfoContext";

type InfoProviderProps = Omit<ProviderProps<InfoContextType>, "value">;

const isIOS = () => /iPad|iPhone|iPod/i.test(navigator.userAgent);
const isMobile = () => /iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini|X11/i.test(navigator.userAgent);
const isMac = () => navigator.userAgent.includes("Mac");

export function InfoProvider(props: InfoProviderProps) {
  const [iOS, setIOS] = useState<boolean>(isIOS());
  const [mobile, setMobile] = useState<boolean>(isMobile());
  const [mac, setMac] = useState<boolean>(isMac());
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [windowScrollX, setWindowScrollX] = useState<number>(window.scrollX);
  const [windowScrollY, setWindowScrollY] = useState<number>(window.scrollY);

  const onResize = () => {
    setIOS(isIOS());
    setMobile(isMobile());
    setMac(isMac);
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  const onScroll = () => {
    setWindowScrollX(window.scrollX);
    setWindowScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  });

  return <InfoContext.Provider value={{ iOS, mobile, mac, windowWidth, windowHeight, windowScrollX, windowScrollY }} {...props} />;
}
