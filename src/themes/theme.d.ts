import ColorOption from "@/models/ColorOption";
import "@mui/material/styles";
import { CSSProperties } from "node_modules/@mui/material/styles/createMixins";

export type ThemeConstants = {
  scalingFactor: number;
  scrollbarSize: number;
  sidebarWidth: number;
  miniSidebarWidth: number;
  sidebarIconSize: number;
  sidebarLeftPadding: number;
  headerHeight: number;
  xsHeaderHeight: number;
  topHeaderHeight: number;
};

export type ScrollbarPalette = {
  hover: {
    thumbBackground: string;
    thumbBorder: string;
    track: string;
  };
  thumb: {
    hover: {
      background: string;
    };
  };
};

export type BorderShape = {
  smallBorder: string;
  mediumBorder: string;
  largeBorder: string;
};

declare module "@mui/material/styles" {
  export interface Theme {
    constants: ThemeConstants;
    border: BorderShape;
  }

  export interface ThemeOptions {
    constants?: ThemeConstants;
    border?: Partial<BorderShape>;
  }

  export interface Palette {
    scrollbar: ScrollbarPalette;
    isPaletteColorOption: (color?: string) => color is ColorOption;
  }

  export interface PaletteOptions {
    scrollbar?: ScrollbarPalette;
    isPaletteColorOption?: (color?: string) => color is ColorOption;
  }

  export interface ThemeVars {
    border: BorderShape;
  }

  export interface SimplePaletteColorOptions {
  }

  export interface PaletteColor {
  }

  export interface Mixins {
    scrollbar: CSSProperties;
    temporaryScrollbar: CSSProperties;
    hideNumberInputArrows: CSSProperties;
  }

  export interface CommonColors {
  }

  export interface Duration {
    long: number;
  }
}

// Update the Button's color prop options
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
  }
}
