// When using TypeScript 4.x and above
import type { } from "@mui/lab/themeAugmentation";
// When using TypeScript 3.x and below
// import "@mui/lab/themeAugmentation";

import { smAndUpMediaQuery } from "@/contexts/breakpoints";
import ColorOption, { colorOptions } from "@/models/ColorOption";
import { alpha, createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import type { } from "@mui/material/themeCssVarsAugmentation";

const lightGrey = grey[300];
const normalGrey = grey[500];
const darkGrey = grey[700];
const scalingFactor = 8;
const scrollbarSize = 10;
const sidebarWidth = 260;
const miniSidebarWidth = 80;
const sidebarIconSize = 24;
const sidebarLeftPadding = (miniSidebarWidth - sidebarIconSize) / 2;
const headerHeight = 64;
const xsHeaderHeight = 56;
const isPaletteColorOption = (color?: string): color is ColorOption => colorOptions.some((value) => value === color);

const mainTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: "#2C2C2C",
          paper: "#2C2C2C",
        },
        scrollbar: {
          hover: {
            thumbBackground: alpha(normalGrey, 0.4),
            thumbBorder: darkGrey,
            track: darkGrey,
          },
          thumb: {
            hover: {
              background: normalGrey,
            },
          },
        },
        isPaletteColorOption,
      },
    },
    light: {
      palette: {
        warning: {
          main: "#ffc107",
          dark: "#c69500",
          light: "#ffcd39",
        },
        background: {
          paper: "#f5f5f5",
          default: "#e5e4e2",
        },
        scrollbar: {
          hover: {
            thumbBackground: alpha(normalGrey, 0.4),
            thumbBorder: lightGrey,
            track: lightGrey,
          },
          thumb: {
            hover: {
              background: alpha(normalGrey, 0.6),
            },
          },
        },
        isPaletteColorOption,
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  },
  constants: {
    scalingFactor,
    scrollbarSize,
    sidebarWidth,
    miniSidebarWidth,
    sidebarIconSize,
    sidebarLeftPadding,
    headerHeight,
    xsHeaderHeight,
  },
  mixins: {
    scrollbar: {
      "@media (pointer: fine)": {
        "&::-webkit-scrollbar": {
          width: scrollbarSize,
          height: scrollbarSize,
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: scrollbarSize,
          backgroundColor: "var(--mui-palette-scrollbar-hover-track)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--mui-palette-scrollbar-hover-thumbBackground)",
          borderRadius: scrollbarSize,
          border: "2px solid var(--mui-palette-scrollbar-hover-thumbBorder)",
          "&:hover": {
            backgroundColor: "var(--mui-palette-scrollbar-thumb-hover-background)",
          },
        },
        "&::-webkit-scrollbar-button": {
          display: "none",
        },
        "&::-webkit-scrollbar-corner": {
          display: "none",
        },
      },
    },
    temporaryScrollbar: {
      "@media (pointer: fine)": {
        "&::-webkit-scrollbar": {
          width: scrollbarSize,
          height: scrollbarSize,
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: scrollbarSize,
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "transparent",
          borderRadius: scrollbarSize,
          border: "2px solid transparent",
        },
        "&::-webkit-scrollbar-button": {
          display: "none",
        },
        "&::-webkit-scrollbar-corner": {
          display: "none",
        },
        "&:hover": {
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "var(--mui-palette-scrollbar-hover-thumbBackground)",
            borderColor: "var(--mui-palette-scrollbar-hover-thumbBorder)",
            "&:hover": {
              backgroundColor: "var(--mui-palette-scrollbar-thumb-hover-background)",
            },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "var(--mui-palette-scrollbar-hover-track)",
          },
        },
      },
    },
    hideNumberInputArrows: {
      "&[type=number]": {
        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
          WebkitAppearance: "none",
          margin: 0,
        },
        MozAppearance: "textfield",
        appearance: "textfield",
      },
    },
  },
  transitions: {
    duration: {
      long: 1000,
    },
  },
  shape: {
    smallBorder: "1px solid var(--mui-palette-divider)",
    mediumBorder: "2px solid var(--mui-palette-divider)",
    largeBorder: "4px solid var(--mui-palette-divider)",
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 4,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.mixins.scrollbar,
        }),
      },
    },
    MuiDrawer: {
      defaultProps: {
        PaperProps: {
          elevation: 4,
        },
      },
      styleOverrides: {
        root: {
          width: sidebarWidth,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          overflowX: "hidden",
        },
        paper: {
          width: sidebarWidth,
          border: "none",
          overflowX: "hidden",
          ".MuiListItemButton-root": {
            ".MuiListItemIcon-root:first-of-type": {
              ".MuiSvgIcon-root": {
                fontSize: sidebarIconSize,
              },
            },
          },
          "> .MuiList-root": {
            "> .MuiListItem-root": {
              "> .MuiListItemButton-root": {
                paddingLeft: sidebarLeftPadding,
              },
            },
          },
          ".os-viewport": {
            "> .MuiList-root": {
              "> .MuiListItem-root": {
                "> .MuiListItemButton-root": {
                  paddingLeft: sidebarLeftPadding,
                },
              },
            },
          },
        },
      },
    },
    MuiSwipeableDrawer: {
      defaultProps: {
        PaperProps: {
          elevation: 4,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: xsHeaderHeight,
          [smAndUpMediaQuery(theme.breakpoints)]: {
            minHeight: headerHeight,
          },
        }),
      },
    },
    MuiListItem: {
      defaultProps: {
        disablePadding: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          textarea: {
            ...theme.mixins.scrollbar,
          },
          fieldset: {
            border: theme.shape.smallBorder,
          },
          ".MuiInputBase-root": {
            ".MuiInputBase-input": {
              ...theme.mixins.hideNumberInputArrows,
            },
            "&.Mui-disabled": {
              ".MuiInputAdornment-root": {
                color: theme.palette.action.disabled,
              },
            },
          },
        }),
      },
    },
    MuiInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          ".MuiInputBase-input": {
            ...theme.mixins.hideNumberInputArrows,
          },
          "&.Mui-disabled": {
            ".MuiInputAdornment-root": {
              color: theme.palette.action.disabled,
            },
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
    MuiSlider: {
      styleOverrides: {
        vertical: {
          "input[type=\"range\"]": {
            WebkitAppearance: "slider-vertical",
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.mixins.scrollbar,
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.mixins.scrollbar,
        }),
      },
    },
    MuiAccordion: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "code&": {
            fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            fontSize: "initial",
            fontWeight: "initial",
            lineHeight: "initial",
            letterSpacing: "initial",
          },
        },
      },
    },
  },
});

export default mainTheme;
