import { useEffect } from "react";
import { ConfirmationDialog } from "./features/confirmationDialog";
import { NotificationSnackbar, useNotificationScheduler } from "./features/notification";
import useAppDispatch from "./hooks/useAppDispatch";
import { loadAuthStateFromLocalAsync } from "./redux/slices/authSlice";

function OneTimeSetup() {
  const dispatch = useAppDispatch();
  useNotificationScheduler();

  useEffect(() => {
    // load authentication state from local storage when start app
    dispatch(loadAuthStateFromLocalAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NotificationSnackbar />
      <ConfirmationDialog />
    </>
  );
}

export default OneTimeSetup;
