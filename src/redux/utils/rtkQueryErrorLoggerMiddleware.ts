import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { pushNotification } from "../slices/notificationSlice";

/**
 * Middleware that display errors from RTK Query requests as toast notification.
 */
const rtkQueryErrorLoggerMiddleware: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    api.dispatch(pushNotification({
      severity: "error",
      // todo: get the error message from the action
      text: extractErrorMessage(action.payload as FetchBaseQueryError),
    }));
  }

  return next(action);
};

const extractErrorMessage = (payload: FetchBaseQueryError): string => {
  if ("error" in payload) {
    return payload.error;
  }

  if (typeof payload.data === "string") {
    return payload.data;
  }

  const defaultMessage = "An error occurred. Please try again later.";

  return defaultMessage;
};

export default rtkQueryErrorLoggerMiddleware;
