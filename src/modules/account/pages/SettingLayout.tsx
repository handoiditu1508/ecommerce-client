import useRouteMatch from "@/hooks/useRouteMatch";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";

const routePatterns: string[] = ["/account/security", "/account/change-password", "/account/change-email", "/account"];

function SettingLayout() {
  const { t: tAccount } = useTranslation("account");
  const routeMatch = useRouteMatch(routePatterns);
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
        <Tab label={tAccount("profile")} value="/account" to="/account" component={Link} />
        <Tab label={tAccount("security")} value="/account/security" to="/account/security" component={Link} />
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
