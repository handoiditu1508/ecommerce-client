import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BreakpointsProvider } from "./contexts/breakpoints";
import { InfoProvider } from "./contexts/info";
import { ConfirmationDialogProvider } from "./features/confirmationDialog";
import "./i18n";
import "./index.scss";
import store from "./redux/store";
import AppThemeProvider from "./themes/AppThemeProvider";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>{/* redux store */}
      <ConfirmationDialogProvider>{/* shared confirmation dialog */}
        <InfoProvider>{/* info about style and environment changes */}
          <BrowserRouter>{/* react router */}
            <AppThemeProvider noSsr>{/* mui theme */}
              <BreakpointsProvider>{/* breakpoints helper */}
                <App />
              </BreakpointsProvider>
            </AppThemeProvider>
          </BrowserRouter>
        </InfoProvider>
      </ConfirmationDialogProvider>
    </Provider>
  </React.StrictMode>
);
