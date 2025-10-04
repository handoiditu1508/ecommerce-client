import authSample from "@/assets/auth-sample.jpg";
import Suspense from "@/components/Suspense";
import { BreakpointsContext, smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  const theme = useTheme();
  const { xsAndDown } = useContext(BreakpointsContext);

  return (
    <Paper elevation={0} square>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "space-evenly",
          gap: 3,
          p: 3,
          [smAndDownMediaQuery(theme.breakpoints)]: {
            p: 0,
          },
        }}>
        <Box
          sx={{
            borderRadius: 4,
            backgroundColor: theme.vars.palette.primary.light,
            backgroundImage: `url(${authSample})`,
            backgroundRepeat: "repeat",
            flex: 1,
            [smAndDownMediaQuery(theme.breakpoints)]: {
              borderRadius: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            },
          }}
        >
          {xsAndDown && <>
            <Box sx={{
              width: "100%",
              height: "30%",
              backgroundColor: theme.vars.palette.background.paper,
            }}
            />
            <Box sx={{
              width: 0,
              height: 0,
              borderTop: `30vh solid ${theme.vars.palette.background.paper}`,
              borderLeft: "100vw solid transparent",
            }}
            />
          </>}
        </Box>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            [smAndDownMediaQuery(theme.breakpoints)]: {
              borderRadius: 20,
              maxWidth: theme.breakpoints.values.sm,
              zIndex: 1,
            },
            [xsAndDownMediaQuery(theme.breakpoints)]: {
              backgroundColor: "transparent",
              borderRadius: 0,
            },
          }}
        >
          <Suspense>
            <Outlet />
          </Suspense>
        </Paper>
      </Container>
    </Paper>
  );
}

export default AuthLayout;
