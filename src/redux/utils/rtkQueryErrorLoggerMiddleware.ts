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
      text: extractErrorMessage(action.payload),
    }));
  }

  return next(action);
};

const extractErrorMessage = (payload: unknown): string => {
  const defaultMessage = "An error occurred. Please try again later.";
  if (!payload) {
    return defaultMessage;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload !== "object") {
    return defaultMessage;
  }

  if ("error" in payload && typeof payload.error === "string") {
    return payload.error;
  }

  return defaultMessage;
};

export default rtkQueryErrorLoggerMiddleware;
