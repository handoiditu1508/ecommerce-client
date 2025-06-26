import { Breakpoints } from "@mui/material";

export const xsMediaQuery = (breakpoints: Breakpoints) => breakpoints.only("xs");
export const xsAndUpMediaQuery = (breakpoints: Breakpoints) => breakpoints.up("xs");
export const smAndDownMediaQuery = (breakpoints: Breakpoints) => breakpoints.down("md");
export const smMediaQuery = (breakpoints: Breakpoints) => breakpoints.only("sm");
export const smAndUpMediaQuery = (breakpoints: Breakpoints) => breakpoints.up("sm");
export const mdAndDownMediaQuery = (breakpoints: Breakpoints) => breakpoints.down("lg");
export const mdMediaQuery = (breakpoints: Breakpoints) => breakpoints.only("md");
export const mdAndUpMediaQuery = (breakpoints: Breakpoints) => breakpoints.up("md");
export const lgAndDownMediaQuery = (breakpoints: Breakpoints) => breakpoints.down("xl");
export const lgMediaQuery = (breakpoints: Breakpoints) => breakpoints.only("lg");
export const lgAndUpMediaQuery = (breakpoints: Breakpoints) => breakpoints.up("lg");
// export const xlMediaQuery = (breakpoints: Breakpoints) => breakpoints.only("xl");
// export const xlAndUpMediaQuery = (breakpoints: Breakpoints) => breakpoints.up("xl");
