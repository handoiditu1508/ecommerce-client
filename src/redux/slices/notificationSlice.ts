import { NotificationMessage } from "@/features/notification";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";

export type NotificationState = {
  notifications: NotificationMessage[];
  timeoutId?: number;
  shouldSetTimeout: boolean;
};

const initialState: NotificationState = {
  notifications: [],
  shouldSetTimeout: true,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<NotificationMessage>) => {
      action.payload.id ||= uuidv4();
      state.notifications.push(action.payload);
    },
    nextNotification: (state) => {
      clearTimeout(state.timeoutId);
      state.shouldSetTimeout = true;
      state.notifications.shift();
    },
    setTimeoutId: (state, action: PayloadAction<number>) => {
      state.timeoutId = action.payload;
    },
    setShouldSetTimeout: (state, action: PayloadAction<boolean>) => {
      state.shouldSetTimeout = action.payload;
    },
  },
});

export const {
  pushNotification,
  nextNotification,
  setTimeoutId,
  setShouldSetTimeout,
} = notificationSlice.actions;

export const notificationSelectors = {
  notifications: (state: RootState) => state.notification.notifications,
  currentNotification: (state: RootState) => state.notification.notifications[0],
  timeoutId: (state: RootState) => state.notification.timeoutId,
  shouldSetTimeout: (state: RootState) => state.notification.shouldSetTimeout,
};
