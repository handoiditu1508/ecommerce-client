import useRouteMatch from "@/hooks/useRouteMatch";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Link, Outlet } from "react-router-dom";

function SettingLayout() {
  const routeMatch = useRouteMatch(["/account/change-password", "/account/change-email", "/account"]);
  const currentTab = routeMatch?.pattern?.path ?? "/account";

  return (
    <Box sx={{
      display: "flex",
    }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentTab}
        sx={{
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Tab label="Profile" value="/account" to="/account" component={Link} />
        <Tab label="Change Email" value="/account/change-email" to="/account/change-email" component={Link} />
        <Tab label="Change Password" value="/account/change-password" to="/account/change-password" component={Link} />
      </Tabs>
      <Box sx={{
        flex: 1,
        px: 2,
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default SettingLayout;
