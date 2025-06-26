import CONFIG from "@/configs";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { nextNotification, selectCurrentNotification } from "@/redux/slices/notificationSlice";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, IconButton, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";

function NotificationSnackbar() {
  const dispatch = useAppDispatch();
  const currentNotification = useAppSelector(selectCurrentNotification);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentNotification) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [currentNotification]);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    if (reason === "closebutton") {
      dispatch(nextNotification());
    }
    setOpen(false);
  };

  const handleClickCloseButton = (event: React.SyntheticEvent | Event) => handleClose(event, "closebutton");

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClickCloseButton}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (currentNotification
    ? <Snackbar
      key={currentNotification.id}
      open={open}
      autoHideDuration={CONFIG.NOTIFICATION_MESSAGE_TIMEOUT}
      message={!currentNotification.severity && currentNotification.text}
      action={!currentNotification.severity && action}
      onClose={handleClose}>
      {currentNotification.severity && <Alert
        severity={currentNotification.severity}
        elevation={6}
        variant="filled"
        sx={{ width: "100%" }}
        onClose={handleClickCloseButton}>
        {currentNotification.text}
      </Alert>}
    </Snackbar>
    : null);
}

export default NotificationSnackbar;
