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

export const {
  addToCart,
} = cartSlice.actions;

export const selectIsCartHydrated = (state: RootState) => isCartHydrated(state.cart);

export default cartSlice;
