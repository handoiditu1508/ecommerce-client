import { ThemeProvider, ThemeProviderProps } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import adminTheme from "./adminTheme";
import clientTheme from "./clientTheme";

function AppThemeProvider(props: Omit<ThemeProviderProps, "theme">) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ThemeProvider theme={isAdminRoute ? adminTheme : clientTheme} {...props} />
  );
}

export default AppThemeProvider;
