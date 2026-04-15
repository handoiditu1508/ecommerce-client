import { isAnyOf, TypedStartListening } from "@reduxjs/toolkit";
import { addToCart, removeFromCart, selectIsCartHydrated } from "../slices/cartSlice";
import { AppDispatch, RootState } from "../store";
import { cartStorageKey, dehydrateCartItemData, DehydratedCartItemData } from "../utils/cartUtils";

const registerCartListener = (startAppListening: TypedStartListening<RootState, AppDispatch, unknown>) => {
  startAppListening({
    matcher: isAnyOf(addToCart, removeFromCart),
    effect: async (action, api) => {
      // cancel previous pending executions
      api.cancelActiveListeners();

      // wait (bebounce)
      await api.delay(1000);

      const state = api.getState();
      const isCartHydrated = selectIsCartHydrated(state);
      const dehydratedCartItemDates: DehydratedCartItemData[] = isCartHydrated
        ? state.cart.cartItemDatas.map(dehydrateCartItemData)
        : state.cart.dehydratedCartItemDatas;
      try {
        const serialized = JSON.stringify(dehydratedCartItemDates);
        localStorage.setItem(cartStorageKey, serialized);
      } catch (error) {
        console.error("error saving cart!", error, dehydratedCartItemDates);
      }
    },
  });
};

export default registerCartListener;
