import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { GetNewProductsQuery } from "@/models/apis/product/getNewProducts";
import { GetProductQuery } from "@/models/apis/product/getProduct";
import { GetProductsToRehydrateCartQuery } from "@/models/apis/product/getProductsToRehydrateCart";
import { CountSearchProductsQuery, SearchProductsQuery } from "@/models/apis/product/searchProducts";
import Product, { ProductView } from "@/models/entities/Product";
import { providesCountTag, providesIdTag, providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const productApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewProducts: builder.query<ProductView[], GetNewProductsQuery>({
      query: (arg) => ({
        url: "/products/latest",
        method: "GET",
        params: arg,
      }),
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
    getDiscountedProducts: builder.query<ProductView[], GetDiscountedProductsQuery>({
      query: (arg) => ({
        url: "/products/discount",
        method: "GET",
        params: arg,
      }),
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
    searchProducts: builder.query<ProductView[], SearchProductsQuery>({
      query: (arg) => ({
        url: "/products/search",
        method: "GET",
        params: arg,
      }),
    }),
    countAllProducts: builder.query<number, void>({
      query: () => "/products/count/all",
      providesTags: (_result, error) => providesCountTag("Product", error),
    }),
    countDiscountedProducts: builder.query<number, void>({
      query: () => "/products/count/discount",
      providesTags: (_result, error) => providesCountTag("Product", error),
    }),
    countSearchProducts: builder.query<number, CountSearchProductsQuery>({
      query: (arg) => ({
        url: "/products/count/search",
        method: "GET",
        params: arg,
      }),
      providesTags: (_result, error) => providesCountTag("Product", error),
    }),
    getProduct: builder.query<Product, GetProductQuery>({
      query: (arg) => ({
        url: `/products/${arg.productId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("Product", arg.productId, error),
    }),
    getProductsToRehydrateCart: builder.query<Product[], GetProductsToRehydrateCartQuery>({
      query: (arg) => ({
        url: "/products/rehydratecart",
        method: "GET",
        params: {
          ids: arg.productIds,
        },
      }),
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
  }),
});

export default productApi;

export const {
  useGetNewProductsQuery,
  useCountAllProductsQuery,
  useGetDiscountedProductsQuery,
  useCountDiscountedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useCountSearchProductsQuery,
  useLazyCountSearchProductsQuery,
  useGetProductQuery,
  useGetProductsToRehydrateCartQuery,
} = productApi;
