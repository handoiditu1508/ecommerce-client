import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import appApi from "./apis/appApi";
import authSlice from "./slices/authSlice";
import brandSlice from "./slices/brandSlice";
import cartSlice from "./slices/cartSlice";
import categorySlice from "./slices/categorySlice";
import counterSlice from "./slices/counterSlice";
import { notificationSlice } from "./slices/notificationSlice";
import roleSlice from "./slices/roleSlice";
import { getPreloadedCartState } from "./utils/cartUtils";
import listenerMiddleware from "./utils/listenerMiddleware";
import rtkQueryErrorLoggerMiddleware from "./utils/rtkQueryErrorLoggerMiddleware";

// development environment only
// const reduxLogger = require("redux-logger");
// const logger = reduxLogger.createLogger();

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [brandSlice.name]: brandSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
    [categorySlice.name]: categorySlice.reducer,
    [counterSlice.name]: counterSlice.reducer,
    [notificationSlice.name]: notificationSlice.reducer,
    [roleSlice.name]: roleSlice.reducer,
    [appApi.reducerPath]: appApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
      appApi.middleware,
      rtkQueryErrorLoggerMiddleware,
      // logger,
    )
    .prepend(
      listenerMiddleware.middleware,
    ),
  preloadedState: {
    cart: getPreloadedCartState(),
  },
});

setupListeners(store.dispatch);

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
