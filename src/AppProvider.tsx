import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import { BreakpointsProvider } from "./contexts/breakpoints";
import { InfoProvider } from "./contexts/info";
import { ConfirmationDialogProvider } from "./features/confirmationDialog";
import OneTimeSetup from "./OneTimeSetup";
import store from "./redux/store";
import { mainTheme } from "./themes";

function AppProvider() {
  return (
    <Provider store={store}>{/* redux store */}
      <ConfirmationDialogProvider>{/* shared confirmation dialog */}
        <InfoProvider>{/* info about style and environment changes */}
          <ThemeProvider theme={mainTheme} noSsr>{/* mui theme */}
            <BreakpointsProvider>{/* breakpoints helper */}
              <Outlet />
              <OneTimeSetup />
            </BreakpointsProvider>
          </ThemeProvider>
        </InfoProvider>
      </ConfirmationDialogProvider>
    </Provider>
  );
}

export default AppProvider;
