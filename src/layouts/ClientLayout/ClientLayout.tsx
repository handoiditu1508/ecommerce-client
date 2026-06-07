import RouteBasedBreadcrumbs from "@/components/RouteBasedBreadcrumbs";
import Suspense from "@/components/Suspense";
import { BreakpointsContext } from "@/contexts/breakpoints";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import withHeaderProvider from "./Header/withHeaderProvider";
import LayoutContainer from "./LayoutContainer";

function InnerClientLayout() {
  const { xsAndDown } = useContext(BreakpointsContext);
  const { t: tMain } = useTranslation("main");
  const bodyContentRef = useRef<HTMLElement>({} as HTMLElement);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const bodyContentHeight = entry.target.clientHeight;
        document.body.style.setProperty("--body-content-height", `${bodyContentHeight}px`);
      }
    });
    resizeObserver.observe(bodyContentRef.current);

    return () => {
      resizeObserver.disconnect();
      document.body.style.removeProperty("--body-content-height");
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        ref={bodyContentRef}
        sx={{
          mt: "var(--header-client-height)",
          flex: 1,
        }}>
        <LayoutContainer disableGutters={false}>
          <RouteBasedBreadcrumbs sx={{ mt: 2 }} />
        </LayoutContainer>
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
          <BottomNavigationAction label={tMain("home")} icon={<HomeIcon />} component={Link} to="/" />
          <BottomNavigationAction label={tMain("cart")} icon={<ShoppingCartIcon />} component={Link} to="/cart" />
        </BottomNavigation>
      </>}
    </Box>
  );
}

const ClientLayout = withHeaderProvider(InnerClientLayout);

export default ClientLayout;
