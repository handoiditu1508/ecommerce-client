import Product from "@/models/entities/Product";
import { createAsyncThunk, createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import productApi from "../apis/productApi";
import { RootState } from "../store";
import { CartItemData, CartProductVariantData, DehydratedCartItemData, generateCartItemData, generateCartProductVariantData, hydrateCartItemData, refreshCartItemData } from "../utils/cartUtils";

/**
 * Limit products stored in local storage
 */
const productLimit = 50;
const productsAdapter = createEntityAdapter<Product>({
  sortComparer: (product1, product2) => product1.id - product2.id,
});

type CartOwnState = {
  /**
   * This property is loaded from local storage, when empty mean state is hydrated
   */
  dehydratedCartItemDatas: DehydratedCartItemData[];
  cartItemDatas: CartItemData[];
  isRehydratingCart: boolean;
};
export type CartState = EntityState<Product, number> & CartOwnState;

const initialState: CartState = productsAdapter.getInitialState<CartOwnState>({
  dehydratedCartItemDatas: [],
  cartItemDatas: [],
  isRehydratingCart: false,
});
export const cartInitialState = initialState;

export const rehydrateCartAsync = createAsyncThunk<Product[], void>(
  "cart/rehydrateCartAsync",
  async (_arg, thunkApi) => {
    const { cart: cartState } = thunkApi.getState() as RootState;

    if (isCartHydrated(cartState)) {
      throw Error("cart already hydrated!");
    }

    // sort so that cache key serialization can generate the same key even array instances are different
    const response = await thunkApi.dispatch(productApi.endpoints.getProductsToRehydrateCart.initiate({
      productIds: cartState.dehydratedCartItemDatas.map((d) => d.productId).sort(),
    }));

    if (response.data !== undefined) {
      return response.data as Product[];
    }

    throw Error("error rehydrating cart!");
  }
);

export const refreshCartAsync = createAsyncThunk<Product[], void>(
  "cart/refreshCartAsync",
  async (_arg, thunkApi) => {
    const { cart: cartState } = thunkApi.getState() as RootState;

    if (!isCartHydrated(cartState)) {
      throw Error("cart not hydrated");
    }

    const response = await thunkApi.dispatch(productApi.endpoints.getProductsToRehydrateCart.initiate({
      productIds: cartState.ids,
    }));

    if (response.data !== undefined) {
      return response.data as Product[];
    }

    throw Error("error refreshing cart!");
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; productVariantId: number; quantity: number; }>) => {
      if (!action.payload.quantity) {
        return;
      }

      let removedCartData: CartItemData | DehydratedCartItemData | undefined = undefined;
      const isHydrated = isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = addToHydratedDatas(
          state.cartItemDatas,
          action.payload.product,
          action.payload.productVariantId,
          action.payload.quantity
        );

        state.cartItemDatas = cartItemDatas;
        removedCartData = removedData;
      } else {
        const [dehydratedCartItemDatas, removedData] = addToDehydratedDatas(
          state.dehydratedCartItemDatas,
          action.payload.product.id,
          action.payload.productVariantId,
          action.payload.quantity
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
        removedCartData = removedData;
      }

      if (removedCartData) {
        productsAdapter.removeOne(state, removedCartData.productId);
      } else {
        productsAdapter.setOne(state, action.payload.product);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number; productVariantId: number; }>) => {
      let removedCartData: CartItemData | DehydratedCartItemData | undefined = undefined;
      const isHydrated = isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = removeFromHydratedDatas(
          state.cartItemDatas,
          action.payload.productId,
          action.payload.productVariantId
        );

        state.cartItemDatas = cartItemDatas;
        removedCartData = removedData;
      } else {
        const [dehydratedCartItemDatas, removedData] = removeFromDehydratedDatas(
          state.dehydratedCartItemDatas,
          action.payload.productId,
          action.payload.productVariantId
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
        removedCartData = removedData;
      }

      if (removedCartData) {
        productsAdapter.removeOne(state, removedCartData.productId);
      }
    },
    changeProductVariantInCart: (state, action: PayloadAction<{ product: Product; prevProductVariantId: number; nextProductVariantId: number; }>) => {
      if (action.payload.prevProductVariantId === action.payload.nextProductVariantId) {
        return;
      }

      let removedCartData: CartItemData | DehydratedCartItemData | undefined = undefined;
      const isHydrated = isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = changeHydratedProductVariantData(
          state.cartItemDatas,
          action.payload.product,
          action.payload.prevProductVariantId,
          action.payload.nextProductVariantId
        );

        state.cartItemDatas = cartItemDatas;
        removedCartData = removedData;
      } else {
        const [dehydratedCartItemDatas, removedData] = changeDehydratedProductVariantData(
          state.dehydratedCartItemDatas,
          action.payload.product.id,
          action.payload.prevProductVariantId,
          action.payload.nextProductVariantId
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
        removedCartData = removedData;
      }

      if (removedCartData) {
        productsAdapter.removeOne(state, removedCartData.productId);
      }
    },
    setQuantityForCart: (state, action: PayloadAction<{ product: Product; productVariantId: number; quantity: number; }>) => {
      if (!action.payload.quantity) {
        return;
      }

      let removedCartData: CartItemData | DehydratedCartItemData | undefined = undefined;
      const isHydrated = isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = setQuantityForHydratedDatas(
          state.cartItemDatas,
          action.payload.product,
          action.payload.productVariantId,
          action.payload.quantity
        );

        state.cartItemDatas = cartItemDatas;
        removedCartData = removedData;
      } else {
        const [dehydratedCartItemDatas, removedData] = setQuantityForDehydratedDatas(
          state.dehydratedCartItemDatas,
          action.payload.product.id,
          action.payload.productVariantId,
          action.payload.quantity
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
        removedCartData = removedData;
      }

      if (removedCartData) {
        productsAdapter.removeOne(state, removedCartData.productId);
      } else {
        productsAdapter.setOne(state, action.payload.product);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrateCartAsync.pending, (state) => {
        state.isRehydratingCart = true;
      })
      .addCase(rehydrateCartAsync.fulfilled, (state, action) => {
        state.isRehydratingCart = false;
        // only cache products that still in cart (in case cart data are removed when products returned)
        const uniqueIdSet = new Set(state.dehydratedCartItemDatas.map((d) => d.productId));
        productsAdapter.setMany(state, action.payload.filter((p) => uniqueIdSet.has(p.id)));
        // update hydrated cart data
        state.cartItemDatas = state.dehydratedCartItemDatas
          .filter((dehydratedData) => dehydratedData.productId in state.entities)
          .map((dehydratedData) => hydrateCartItemData(dehydratedData, state.entities[dehydratedData.productId]));
        // clear dehydrated cart data
        state.dehydratedCartItemDatas = [];
      })
      .addCase(rehydrateCartAsync.rejected, (state) => {
        state.isRehydratingCart = false;
      })
      .addCase(refreshCartAsync.fulfilled, (state, action) => {
        // use updateMany to update cache without adding anymore cache (in case cart data are removed when products returned)
        productsAdapter.updateMany(state, action.payload.map((p) => ({ id: p.id, changes: p })));
        for (const data of state.cartItemDatas) {
          if (data.productId in state.entities) {
            refreshCartItemData(state.entities[data.productId], data);
          }
        }
      });
  },
});

const isCartHydrated = (state: CartState) => !state.dehydratedCartItemDatas.length;

const addToDehydratedDatas = (
  datas: DehydratedCartItemData[],
  productId: number,
  productVariantId: number,
  quantity: number
): [DehydratedCartItemData[], DehydratedCartItemData | undefined] => {
  if (datas.length > productLimit) {
    return [datas, undefined];
  }

  let removedData: DehydratedCartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === productId);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // update quantity
    data.productVariants[productVariantId] = data.productVariants[productVariantId] || 0;
    data.productVariants[productVariantId] += quantity;

    // check invalid quantity
    if (data.productVariants[productVariantId] < 1) {
      delete data.productVariants[productVariantId];
    }

    // check over all quantity of data
    const hasVariantData = Object.values(data.productVariants).some((quantity) => quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  } else {
    // add new data to top
    datas.unshift({
      productId: productId,
      productVariants: {
        [productVariantId]: quantity,
      },
    });
  }

  return [datas, removedData];
};

const removeFromDehydratedDatas = (
  datas: DehydratedCartItemData[],
  productId: number,
  productVariantId: number
): [DehydratedCartItemData[], DehydratedCartItemData | undefined] => {
  let removedData: DehydratedCartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === productId);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // remove variant data
    delete data.productVariants[productVariantId];

    // check over all quantity of data
    const hasVariantData = Object.values(data.productVariants).some((quantity) => quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  }

  return [datas, removedData];
};

const changeDehydratedProductVariantData = (
  datas: DehydratedCartItemData[],
  productId: number,
  prevProductVariantId: number,
  nextProductVariantId: number,
): [DehydratedCartItemData[], DehydratedCartItemData | undefined] => {
  let removedData: DehydratedCartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === productId);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // move quantity to the new variant data
    data.productVariants[nextProductVariantId] = (data.productVariants[nextProductVariantId] || 0) + (data.productVariants[prevProductVariantId] || 0);

    // remove variant data
    delete data.productVariants[prevProductVariantId];

    // check invalid variant data quantity
    if (data.productVariants[nextProductVariantId] < 1) {
      delete data.productVariants[nextProductVariantId];
    }

    // check over all quantity of data
    const hasVariantData = Object.values(data.productVariants).some((quantity) => quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  }

  return [datas, removedData];
};

const setQuantityForDehydratedDatas = (
  datas: DehydratedCartItemData[],
  productId: number,
  productVariantId: number,
  quantity: number
): [DehydratedCartItemData[], DehydratedCartItemData | undefined] => {
  let removedData: DehydratedCartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === productId);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    if (quantity > 0) {
      data.productVariants[productVariantId] = quantity;
    } else {
      delete data.productVariants[productVariantId];
    }

    // check over all quantity of data
    const hasVariantData = Object.values(data.productVariants).some((quantity) => quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  } else {
    // add new data to top
    datas.unshift({
      productId: productId,
      productVariants: {
        [productVariantId]: quantity,
      },
    });
  }

  return [datas, removedData];
};

const addToHydratedDatas = (
  datas: CartItemData[],
  product: Product,
  productVariantId: number,
  quantity: number
): [CartItemData[], CartItemData | undefined] => {
  if (datas.length > productLimit) {
    return [datas, undefined];
  }

  let removedData: CartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === product.id);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // get variant data
    let variantDataIndex = data.productVariants.findIndex((v) => v.productVariantId === productVariantId);
    let variantData: CartProductVariantData | undefined = undefined;
    if (variantDataIndex === -1) {
      variantData = generateCartProductVariantData(product, productVariantId, 0);
      if (!variantData) {
        return [datas, removedData];
      }
      variantDataIndex = data.productVariants.length;
      data.productVariants.push(variantData);
    } else {
      variantData = data.productVariants[variantDataIndex];
    }

    // update variant data quantity
    variantData.quantity += quantity;

    // check invalid variant data quantity
    if (variantData.quantity < 1) {
      data.productVariants.splice(variantDataIndex, 1);
    }

    // check over all quantity of data
    const hasVariantData = data.productVariants.some((v) => v.quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  } else {
    // add new data to top
    const data = generateCartItemData(product, productVariantId, quantity);
    if (data) {
      datas.unshift(data);
    }
  }

  return [datas, removedData];
};

const removeFromHydratedDatas = (
  datas: CartItemData[],
  productId: number,
  productVariantId: number
): [CartItemData[], CartItemData | undefined] => {
  let removedData: CartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === productId);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // remove variant data
    const variantDataIndex = data.productVariants.findIndex((v) => v.productVariantId === productVariantId);
    if (variantDataIndex !== -1) {
      data.productVariants.splice(variantDataIndex, 1);
    }

    // check over all quantity of data
    const hasVariantData = data.productVariants.some((v) => v.quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  }

  return [datas, removedData];
};

const changeHydratedProductVariantData = (
  datas: CartItemData[],
  product: Product,
  prevProductVariantId: number,
  nextProductVariantId: number
): [CartItemData[], CartItemData | undefined] => {
  let removedData: CartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === product.id);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // move quantity to the new variant data
    const prevVariantDataIndex = data.productVariants.findIndex((v) => v.productVariantId === prevProductVariantId);
    let nextVariantDataIndex = data.productVariants.findIndex((v) => v.productVariantId === nextProductVariantId);
    let nextVariantData: CartProductVariantData | undefined = undefined;
    if (prevVariantDataIndex !== -1) {
      const prevVariantData = data.productVariants[prevVariantDataIndex];
      if (nextVariantDataIndex === -1) {
        nextVariantData = generateCartProductVariantData(product, nextProductVariantId, prevVariantData.quantity);
        if (!nextVariantData) {
          return [datas, removedData];
        }
        nextVariantDataIndex = data.productVariants.length;
        data.productVariants.push(nextVariantData);
      } else {
        nextVariantData = data.productVariants[nextVariantDataIndex];
        nextVariantData.quantity += prevVariantData.quantity;
      }

      // remove variant data
      data.productVariants.splice(prevVariantDataIndex, 1);
      nextVariantDataIndex = nextVariantDataIndex < prevVariantDataIndex ? nextVariantDataIndex : nextVariantDataIndex - 1;

      // check invalid variant data quantity
      if (nextVariantData && nextVariantData.quantity < 1) {
        data.productVariants.splice(nextVariantDataIndex, 1);
      }
    }

    // check over all quantity of data
    const hasVariantData = data.productVariants.some((v) => v.quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  }

  return [datas, removedData];
};

const setQuantityForHydratedDatas = (
  datas: CartItemData[],
  product: Product,
  productVariantId: number,
  quantity: number
): [CartItemData[], CartItemData | undefined] => {
  if (datas.length > productLimit) {
    return [datas, undefined];
  }

  let removedData: CartItemData | undefined = undefined;
  const dataIndex = datas.findIndex((d) => d.productId === product.id);
  if (dataIndex !== -1) {
    const [data] = datas.splice(dataIndex, 1);
    removedData = data;

    // get variant data
    let variantDataIndex = data.productVariants.findIndex((v) => v.productVariantId === productVariantId);
    let variantData: CartProductVariantData | undefined = undefined;
    if (variantDataIndex === -1) {
      variantData = generateCartProductVariantData(product, productVariantId, 0);
      if (!variantData) {
        return [datas, removedData];
      }
      variantDataIndex = data.productVariants.length;
      data.productVariants.push(variantData);
    } else {
      variantData = data.productVariants[variantDataIndex];
    }

    if (quantity > 0) {
      variantData.quantity = quantity;
    } else {
      data.productVariants.splice(variantDataIndex, 1);
    }

    // check over all quantity of data
    const hasVariantData = data.productVariants.some((v) => v.quantity > 0);
    if (hasVariantData) {
    // keep last modified data on top
      datas.unshift(data);
      removedData = undefined;
    }
  } else {
    // add new data to top
    const data = generateCartItemData(product, productVariantId, quantity);
    if (data) {
      datas.unshift(data);
    }
  }

  return [datas, removedData];
};

export const {
  addToCart,
  removeFromCart,
  changeProductVariantInCart,
  setQuantityForCart,
} = cartSlice.actions;

export const selectIsCartHydrated = (state: RootState) => isCartHydrated(state.cart);
export const selectCachedProductIdsFromCart = (state: RootState) => state.cart.ids;

export default cartSlice;
