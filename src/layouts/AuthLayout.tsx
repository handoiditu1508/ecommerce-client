import Suspense from "@/components/Suspense";
import { smAndDownMediaQuery, xsAndDownMediaQuery } from "@/contexts/breakpoints";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  const theme = useTheme();

  return (
    <Paper elevation={0} square>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "space-evenly",
          gap: 4,
          p: 4,
          [smAndDownMediaQuery(theme.breakpoints)]: {
            position: "relative",
            p: 0,
          },
        }}>
        <Box
          sx={{
            borderRadius: 4,
            background: `linear-gradient(160deg, ${theme.vars.palette.primary.main} 10%, ${theme.vars.palette.primary.light} 50%, ${theme.vars.palette.primary.dark} 90%)`,
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
        />
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
