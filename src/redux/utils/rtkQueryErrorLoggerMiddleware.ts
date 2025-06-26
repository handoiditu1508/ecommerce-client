import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { pushNotification } from "../slices/notificationSlice";

/**
 * Middleware that display errors from RTK Query requests as toast notification.
 */
const rtkQueryErrorLoggerMiddleware: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    api.dispatch(pushNotification({
      severity: "error",
      // todo: get the error message from the action
      text: "An error occurred. Please try again later.",
    }));
  }

  return next(action);
};

export default rtkQueryErrorLoggerMiddleware;
