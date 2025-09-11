import Suspense from "@/components/Suspense";
import { BreakpointsContext, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import withHeaderProvider from "./Header/withHeaderProvider";

function InnerClientLayout() {
  const theme = useTheme();
  const { xsAndDown } = useContext(BreakpointsContext);

  return (
    <Box>
      <Header />
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          mt: "var(--header-client-height)",
          [xsAndDownMediaQuery(theme.breakpoints)]: {
            mb: "56px",
          },
        }}>
        <Suspense>
          <Outlet />
        </Suspense>
      </Container>
      {xsAndDown && <BottomNavigation
        showLabels
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Cart" icon={<ShoppingCartIcon />} />
      </BottomNavigation>}
    </Box>
  );
}

const ClientLayout = withHeaderProvider(InnerClientLayout);

export default ClientLayout;
