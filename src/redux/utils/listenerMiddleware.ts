import { createListenerMiddleware } from "@reduxjs/toolkit";
import registerCartListener from "../listeners/cartListener";
import { AppDispatch, RootState } from "../store";

const listenerMiddleware = createListenerMiddleware();
export const startAppListening = listenerMiddleware.startListening.withTypes<RootState, AppDispatch, unknown>();

registerCartListener(startAppListening);

export default listenerMiddleware;
