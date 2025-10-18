import Suspense from "@/components/Suspense";
import { BreakpointsContext } from "@/contexts/breakpoints";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import withHeaderProvider from "./Header/withHeaderProvider";

function InnerClientLayout() {
  const { xsAndDown } = useContext(BreakpointsContext);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          mt: "var(--header-client-height)",
          flex: 1,
        }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </Box>
      <Footer />
      {xsAndDown && <>
        <Box sx={{ height: 56 }} />{/* to prevent content behind bottom navigation */}
        <BottomNavigation
          showLabels
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Cart" icon={<ShoppingCartIcon />} />
        </BottomNavigation>
      </>}
    </Box>
  );
}

const ClientLayout = withHeaderProvider(InnerClientLayout);

export default ClientLayout;
