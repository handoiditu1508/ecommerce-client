import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import FilterCriteria from "./FilterCriteria";

function Sidebar() {
  const theme = useTheme();

  return (
    // fixed sidebar
    // <Drawer
    //   variant="permanent"
    //   sx={{ width: 216 }}
    //   slotProps={{
    //     paper: {
    //       sx: {
    //         width: 216,
    //         boxSizing: "border-box",
    //         border: "none",
    //         mt: `calc(var(--header-client-height) + ${theme.vars.spacing} * 2)`,
    //         borderTop: theme.vars.shape.smallBorder,
    //         borderRight: theme.vars.shape.smallBorder,
    //         height: `calc(100% - var(--footer-height) - var(--header-client-height) - ${theme.vars.spacing} * 2)`,
    //         overflowX: "hidden",
    //       },
    //     },
    //   }}>
    //   <FilterCriteria />
    // </Drawer>
    <Paper
      square
      sx={{
        boxShadow: "none",
        width: 216,
        boxSizing: "border-box",
        borderTop: theme.vars.shape.smallBorder,
        borderRight: theme.vars.shape.smallBorder,
        height: "fit-content",
        mb: -10, // overlap with footer margin top
        overflowX: "hidden",
      }}
    >
      <FilterCriteria />
    </Paper>
  );
}

export default Sidebar;
