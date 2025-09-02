import Fade from "@mui/material/Fade";
import Portal from "@mui/material/Portal";
import { JSX } from "react";

const withFadingOverlay = <P extends JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<P>) => {
  return ({ isShow, ...props }: P & { isShow?: boolean; }) => <Portal>
    <Fade in={isShow}>
      <WrappedComponent {...(props as P)} />
    </Fade>
  </Portal>;
};

export default withFadingOverlay;
