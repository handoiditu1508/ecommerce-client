import Product from "@/models/entities/Product";
import { cartInitialState, CartState } from "../slices/cartSlice";

export type CartItemData = {
  productId: number;
  productName: string;
  productVariants: CartProductVariantData[];
};

export type CartProductVariantData = {
  productVariantId: number;
  productVariantName: string;
  thumbnailPath: string;
  quantity: number;
  price: number;
  discountPrice: number;
  totalPrice: number;
};

export type DehydratedCartItemData = {
  productId: number;
  /**
   * ```
   * { [productVariantId]: cartQuantity }
   * ```
   */
  productVariants: Record<number, number>;
};

export const cartStorageKey = "dehydrated_cart";

export const loadCartDatasFromLocal = (): DehydratedCartItemData[] | undefined => {
  try {
    const serialized = localStorage.getItem(cartStorageKey);
    if (!serialized) {
      return undefined;
    }

    return JSON.parse(serialized);
  } catch (error) {
    console.error("error loading cart!", error);
    localStorage.removeItem(cartStorageKey);

    return undefined;
  }
};

export const getPreloadedCartState = (): CartState => {
  const localCartDatas = loadCartDatasFromLocal();

  if (localCartDatas) {
    return {
      ...cartInitialState,
      dehydratedCartItemDatas: localCartDatas,
    };
  }

  return cartInitialState;
};

export const dehydrateCartItemData = (data: CartItemData): DehydratedCartItemData => {
  const dehydratedData: DehydratedCartItemData = {
    productId: data.productId,
    productVariants: {},
  };

  for (const variantData of data.productVariants) {
    if (variantData.quantity > 0) {
      dehydratedData.productVariants[variantData.productVariantId] = variantData.quantity;
    }
  }

  return dehydratedData;
};

export const hydrateCartItemData = (dehydratedData: DehydratedCartItemData, product: Product): CartItemData => {
  const data: CartItemData = {
    productId: dehydratedData.productId,
    productName: product.name,
    productVariants: [],
  };

  for (const [productVariantIdStr, quantity] of Object.entries(dehydratedData.productVariants)) {
    if (quantity < 1) {
      continue;
    }

    const productVariantId = parseInt(productVariantIdStr);
    const variantData = generateCartProductVariantData(product, productVariantId, quantity);
    if (variantData) {
      data.productVariants.push(variantData);
    }
  }

  return data;
};

export const generateCartProductVariantData = (
  product: Product,
  productVariantId: number,
  quantity: number = 1,
): CartProductVariantData | undefined => {
  const productVariant = product.productVariants.find((v) => v.id === productVariantId);

  if (!productVariant) {
    return undefined;
  }

  const data: CartProductVariantData = {
    productVariantId,
    productVariantName: productVariant.name,
    quantity,
    thumbnailPath: productVariant.thumbnailPath || product.thumbnailPath,
    price: productVariant.price || product.price,
    discountPrice: productVariant.discountPrice || product.discountPrice,
    totalPrice: 0,
  };
  data.totalPrice = data.discountPrice * quantity;

  return data;
};

export const generateCartItemData = (
  product: Product,
  productVariantId: number,
  quantity: number = 1,
): CartItemData | undefined => {
  const variantData = generateCartProductVariantData(product, productVariantId, quantity);

  if (variantData) {
    const data: CartItemData = {
      productId: product.id,
      productName: product.name,
      productVariants: [variantData],
    };

    return data;
  }

  return undefined;
};

export const refreshCartItemData = (product: Product, data: CartItemData) => {
  data.productName = product.name;
  for (let i = data.productVariants.length - 1; i >= 0; i--) {
    const variantData = data.productVariants[i];
    const productVariant = product.productVariants.find((v) => v.id === variantData.productVariantId);
    if (productVariant) {
      variantData.productVariantName = productVariant.name;
      variantData.thumbnailPath = productVariant.thumbnailPath || product.thumbnailPath;
      variantData.price = productVariant.price || product.price;
      variantData.discountPrice = productVariant.discountPrice || product.discountPrice;
      variantData.totalPrice = variantData.discountPrice * variantData.quantity;
    } else {
      data.productVariants.splice(i, 1);
    }
  }
};
