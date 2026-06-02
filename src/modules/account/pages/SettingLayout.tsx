import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

enum TabOption {
  Profile,
  ChangeEmail,
  ChangePassword,
}

function SettingLayout() {
  const [value, setValue] = useState<TabOption>(TabOption.Profile);

  const handleChange = (event: React.SyntheticEvent, value: TabOption) => {
    setValue(value);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: 224 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
      >
        <Tab label="Profile" value={TabOption.Profile} to="/account" component={Link} />
        <Tab label="Change Email" value={TabOption.ChangeEmail} to="/account/change-email" component={Link} />
        <Tab label="Change Password" value={TabOption.ChangePassword} to="/account/change-password" component={Link} />
      </Tabs>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default SettingLayout;
