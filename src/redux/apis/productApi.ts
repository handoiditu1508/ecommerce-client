import { AddProductQuantityCommand } from "@/models/apis/product/addProductQuantity";
import { CreateProductCommand } from "@/models/apis/product/createProduct";
import { DeleteProductCommand } from "@/models/apis/product/deleteProduct";
import { DeleteProductImagesCommand } from "@/models/apis/product/deleteProductImages";
import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { GetLatestProductsQuery } from "@/models/apis/product/getLatestProducts";
import { GetProductQuery } from "@/models/apis/product/getProduct";
import { CountProductsQuery, GetProductsQuery } from "@/models/apis/product/getProducts";
import { GetProductsToRehydrateCartQuery } from "@/models/apis/product/getProductsToRehydrateCart";
import { RecoverProductCommand } from "@/models/apis/product/recoverProduct";
import { ReorderProductImagesCommand } from "@/models/apis/product/reorderProductImages";
import { CountSearchProductsQuery, SearchProductsQuery } from "@/models/apis/product/searchProducts";
import { UpdateProductCommand } from "@/models/apis/product/updateProduct";
import { UpdateProductVariantsCommand } from "@/models/apis/product/updateProductVariants";
import { UpdateProductVariantThumbnailCommand } from "@/models/apis/product/updateProductVariantThumbnail";
import { UploadProductImagesCommand } from "@/models/apis/product/uploadProductImages";
import Product, { ProductView } from "@/models/entities/Product";
import { objectToFormData } from "../utils/formDataUtils";
import {
  invalidatesCountTag,
  invalidatesIdTag,
  invalidatesListTag,
  invalidatesPessimisticIdTag,
  providesCountTag,
  providesIdTag,
  providesListTags,
} from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const productApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLatestProducts: builder.query<ProductView[], GetLatestProductsQuery>({
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
    countProducts: builder.query<number, CountProductsQuery>({
      query: (arg) => ({
        url: "/products/count",
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
    getProducts: builder.query<ProductView[], GetProductsQuery>({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("Product", result, error),
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
    createProduct: builder.mutation<Product, CreateProductCommand>({
      query: (arg) => ({
        url: "/products",
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: createdProduct.id },
              createdProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("Product", error),
        ...invalidatesCountTag("Product", error),
      ],
    }),
    updateProduct: builder.mutation<Product, UpdateProductCommand>({
      query: (arg) => ({
        url: `/products/${arg.id}`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: arg.id },
              updatedProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Product", arg.id, error),
    }),
    updateProductVariants: builder.mutation<Product, UpdateProductVariantsCommand>({
      query: (body) => ({
        url: `/products/${body.id}/variants`,
        method: "PUT",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: arg.id },
              updatedProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Product", arg.id, error),
    }),
    updateProductVariantThumbnail: builder.mutation<Product, UpdateProductVariantThumbnailCommand>({
      query: (arg) => ({
        url: `/products/variants/${arg.id}/thumbnail`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: arg.productId },
              updatedProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Product", arg.productId, error),
    }),
    addProductQuantity: builder.mutation<number, AddProductQuantityCommand>({
      query: (body) => ({
        url: `/products/variants/${body.productVariantId}/quantity`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, error, body) => invalidatesIdTag("Product", body.productId, error),
    }),
    deleteProduct: builder.mutation<Product | undefined, DeleteProductCommand>({
      query: ({ productId, ...arg }) => ({
        url: `/products/${productId}`,
        method: "GET",
        params: arg,
      }),
      invalidatesTags: (_result, error) => invalidatesCountTag("Product", error),
    }),
    uploadProductImages: builder.mutation<Product, UploadProductImagesCommand>({
      query: (arg) => ({
        url: `/products/${arg.productId}/images`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: arg.productId },
              updatedProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Product", arg.productId, error),
    }),
    deleteProductImages: builder.mutation<Product, DeleteProductImagesCommand>({
      query: (body) => ({
        url: `/products/${body.productId}/images/delete`,
        method: "POST",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: arg.productId },
              updatedProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Product", arg.productId, error),
    }),
    reorderProductImages: builder.mutation<Product, ReorderProductImagesCommand>({
      query: (body) => ({
        url: `/products/${body.productId}/images/order`,
        method: "PUT",
        body,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProduct } = await queryFulfilled;
          dispatch(
            productApi.util.upsertQueryData(
              "getProduct",
              { productId: arg.productId },
              updatedProduct,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Product", arg.productId, error),
    }),
    recoverProduct: builder.mutation<Product, RecoverProductCommand>({
      query: ({ productId }) => ({
        url: `/products/${productId}/recover`,
        method: "PUT",
      }),
      invalidatesTags: (_result, error) => invalidatesCountTag("Product", error),
    }),
  }),
});

export default productApi;

export const {
  useGetLatestProductsQuery,
  useCountAllProductsQuery,
  useGetDiscountedProductsQuery,
  useCountDiscountedProductsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useCountSearchProductsQuery,
  useLazyCountSearchProductsQuery,
  useCountProductsQuery,
  useLazyCountProductsQuery,
  useGetProductQuery,
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductsToRehydrateCartQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductVariantsMutation,
  useUpdateProductVariantThumbnailMutation,
  useAddProductQuantityMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImagesMutation,
  useReorderProductImagesMutation,
  useRecoverProductMutation,
} = productApi;
