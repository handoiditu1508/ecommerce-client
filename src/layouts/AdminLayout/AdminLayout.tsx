import Suspense from "@/components/Suspense";
import { BreakpointsContext } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header, { withHeaderProvider } from "./Header";
import LayoutContainer from "./LayoutContainer";
import Sidebar, { SidebarContext, withSidebarProvider } from "./Sidebar";

function InnerAdminLayout() {
  const { sidebarState, miniSidebarTransition, permanentSidebarTransition } = useContext(SidebarContext);
  const { mdAndDown } = useContext(BreakpointsContext);
  const theme = useTheme();

  return (
    <>
      <Paper
        square
        sx={{
          boxShadow: "none",
          overflow: "auto",
          backgroundColor: { lg: theme.vars.palette.background.default },
          backgroundImage: { lg: "none" },
        }}>{/* background for app */}
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            marginLeft: "var(--sidebar-current-width)",
            marginTop: "var(--header-client-height)",
            ...(sidebarState === "mini" && {
              transition: miniSidebarTransition("margin"),
            }),
            ...((sidebarState === "permanent" || sidebarState === "miniHovered") && {
              transition: permanentSidebarTransition("margin"),
            }),
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            minHeight: "calc(100vh - var(--header-client-height))",
          }}>{/* spacing between sidebar & header */}
          <LayoutContainer sx={{
            paddingY: { lg: 4 },
            flexGrow: 1,
            display: { lg: "flex" },
          }}>{/* center content & limit content size */}
            <Paper
              square={mdAndDown}
              sx={{
                boxShadow: "none",
                width: "100%",
              }}>{/* background color for main content */}
              <Suspense>
                <Outlet />
              </Suspense>
            </Paper>
          </LayoutContainer>
          <Footer />
        </Box>
      </Paper>
      {/* shared components */}
    </>
  );
}

const AdminLayout = withHeaderProvider(withSidebarProvider(InnerAdminLayout));

export default AdminLayout;
