import { IconButton, IconButtonProps, alpha, styled, useTheme } from "@mui/material";
import React, { JSX } from "react";

type OwnProps = {
  idleIcon: JSX.Element;
  activeIcon?: JSX.Element;
  customColor?: string;
};

type TogglingIconButtonProps = OwnProps & Omit<IconButtonProps, keyof OwnProps>;

const TogglingIconButton = styled(({ idleIcon, activeIcon, customColor, color, style, ...props }: TogglingIconButtonProps) => {
  const theme = useTheme();
  const standardizedColor = customColor || (theme.palette.isPaletteColorOption(color) && theme.palette[color].main) || color;
  const hoverColor = standardizedColor && standardizedColor.startsWith("#")
    ? alpha(standardizedColor, theme.palette.action.hoverOpacity)
    : `rgba(0, 0, 0, ${theme.palette.action.hoverOpacity})`;

  return (
    <IconButton style={{ ...style, "--custom-color": standardizedColor, "--hover-color": hoverColor } as React.CSSProperties} {...props}>
      {idleIcon}
      {activeIcon || idleIcon}
    </IconButton>
  );
})(() => ({
  ".MuiSvgIcon-root:nth-of-type(2)": {
    display: "none",
    color: "var(--custom-color)",
  },
  ".MuiTouchRipple-root": {
    color: "var(--custom-color)",
  },
  "&:hover": {
    backgroundColor: "var(--hover-color)",
    ".MuiSvgIcon-root:first-of-type": {
      display: "none",
    },
    ".MuiSvgIcon-root:nth-of-type(2)": {
      display: "inline-block",
    },
  },
}));

export default TogglingIconButton;
