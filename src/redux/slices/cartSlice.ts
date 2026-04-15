import Product from "@/models/entities/Product";
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { CartItemData, CartProductVariantData, DehydratedCartItemData, generateCartItemData, generateCartProductVariantData } from "../utils/cartUtils";

const productsAdapter = createEntityAdapter<Product>({
  sortComparer: (product1, product2) => product1.id - product2.id,
});

type CartOwnState = {
  /**
   * This property is loaded from local storage, when empty mean state is hydrated
   */
  dehydratedCartItemDatas: DehydratedCartItemData[];
  cartItemDatas: CartItemData[];
};
export type CartState = EntityState<Product, number> & CartOwnState;

const initialState: CartState = productsAdapter.getInitialState<CartOwnState>({
  dehydratedCartItemDatas: [],
  cartItemDatas: [],
});
export const cartInitialState = initialState;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; productVariantId: number; quantity: number; }>) => {
      if (!action.payload.quantity) {
        return;
      }

      const isHydrated = !isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = addToHydratedDatas(
          state.cartItemDatas,
          action.payload.product,
          action.payload.productVariantId,
          action.payload.quantity
        );

        state.cartItemDatas = cartItemDatas;
        if (removedData) {
          productsAdapter.removeOne(state, removedData.productId);
        } else {
          productsAdapter.setOne(state, action.payload.product);
        }
      } else {
        const [dehydratedCartItemDatas] = addToDehydratedDatas(
          state.dehydratedCartItemDatas,
          action.payload.product.id,
          action.payload.productVariantId,
          action.payload.quantity
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: number; productVariantId: number; }>) => {
      const isHydrated = !isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = removeFromHydratedDatas(
          state.cartItemDatas,
          action.payload.productId,
          action.payload.productVariantId
        );

        state.cartItemDatas = cartItemDatas;
        if (removedData) {
          productsAdapter.removeOne(state, removedData.productId);
        }
      } else {
        const [dehydratedCartItemDatas] = removeFromDehydratedDatas(
          state.dehydratedCartItemDatas,
          action.payload.productId,
          action.payload.productVariantId
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
      }
    },
    changeProductVariantInCart: (state, action: PayloadAction<{ product: Product; prevProductVariantId: number; nextProductVariantId: number; }>) => {
      if (action.payload.prevProductVariantId === action.payload.nextProductVariantId) {
        return;
      }

      const isHydrated = !isCartHydrated(state);
      if (isHydrated) {
        const [cartItemDatas, removedData] = changeHydratedProductVariantData(
          state.cartItemDatas,
          action.payload.product,
          action.payload.prevProductVariantId,
          action.payload.nextProductVariantId
        );

        state.cartItemDatas = cartItemDatas;
        if (removedData) {
          productsAdapter.removeOne(state, removedData.productId);
        }
      } else {
        const [dehydratedCartItemDatas] = changeDehydratedProductVariantData(
          state.dehydratedCartItemDatas,
          action.payload.product.id,
          action.payload.prevProductVariantId,
          action.payload.nextProductVariantId
        );

        state.dehydratedCartItemDatas = dehydratedCartItemDatas;
      }
    },
  },
});

const isCartHydrated = (state: CartState) => !state.dehydratedCartItemDatas.length;

const addToDehydratedDatas = (
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

const addToHydratedDatas = (
  datas: CartItemData[],
  product: Product,
  productVariantId: number,
  quantity: number
): [CartItemData[], CartItemData | undefined] => {
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

export const {
  addToCart,
  removeFromCart,
  changeProductVariantInCart,
} = cartSlice.actions;

export const selectIsCartHydrated = (state: RootState) => isCartHydrated(state.cart);

export default cartSlice;
