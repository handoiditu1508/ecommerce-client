import { useEffect } from "react";
import "./App.scss";
import { ConfirmationDialog } from "./features/confirmationDialog";
import { NotificationSnackbar, useNotificationScheduler } from "./features/notification";
import { useAppDispatch } from "./hooks";
import { loadAuthStateFromLocalAsync } from "./redux/slices/authSlice";
import AppRoutes from "./routes";

function App() {
  const dispatch = useAppDispatch();
  useNotificationScheduler();

  useEffect(() => {
    // load authentication state from local storage when start app
    dispatch(loadAuthStateFromLocalAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppRoutes />
      <NotificationSnackbar />
      <ConfirmationDialog />
    </>
  );
}

export default App;
