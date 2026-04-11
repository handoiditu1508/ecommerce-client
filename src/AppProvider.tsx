import { Provider } from "react-redux";
import { Outlet } from "react-router-dom";
import { BreakpointsProvider } from "./contexts/breakpoints";
import { InfoProvider } from "./contexts/info";
import { ConfirmationDialogProvider } from "./features/confirmationDialog";
import OneTimeSetup from "./OneTimeSetup";
import store from "./redux/store";
import AppThemeProvider from "./themes/AppThemeProvider";

function AppProvider() {
  return (
    <Provider store={store}>{/* redux store */}
      <ConfirmationDialogProvider>{/* shared confirmation dialog */}
        <InfoProvider>{/* info about style and environment changes */}
          <AppThemeProvider noSsr>{/* mui theme */}
            <BreakpointsProvider>{/* breakpoints helper */}
              <Outlet />
              <OneTimeSetup />
            </BreakpointsProvider>
          </AppThemeProvider>
        </InfoProvider>
      </ConfirmationDialogProvider>
    </Provider>
  );
}

export default AppProvider;
