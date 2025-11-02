import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
import FilterCriteria from "./FilterCriteria";

function Sidebar() {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: 216 }}
      slotProps={{
        paper: {
          sx: {
            width: 216,
            boxSizing: "border-box",
            border: "none",
            mt: `calc(var(--header-client-height) + ${theme.vars.spacing} * 2)`,
            borderTop: theme.vars.shape.smallBorder,
            borderRight: theme.vars.shape.smallBorder,
            height: `calc(100% - var(--footer-height) - var(--header-client-height) - ${theme.vars.spacing} * 2)`,
            overflowX: "hidden",
          },
        },
      }}>
      <FilterCriteria />
    </Drawer>
  );
}

export default Sidebar;
