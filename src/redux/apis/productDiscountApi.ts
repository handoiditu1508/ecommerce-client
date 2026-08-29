import { CreateProductDiscountCommand } from "@/models/apis/productDiscount/createProductDiscount";
import { DeleteProductDiscountCommand } from "@/models/apis/productDiscount/deleteProductDiscount";
import { GetProductDiscountQuery } from "@/models/apis/productDiscount/getProductDiscount";
import { CountProductDiscountsQuery, GetProductDiscountsQuery } from "@/models/apis/productDiscount/getProductDiscounts";
import { UpdateProductDiscountCommand } from "@/models/apis/productDiscount/updateProductDiscount";
import ProductDiscount, { ProductDiscountView } from "@/models/entities/ProductDiscount";
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

const productDiscountApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductDiscount: builder.query<ProductDiscount, GetProductDiscountQuery>({
      query: (arg) => ({
        url: `/productdiscounts/${arg.productDiscountId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("ProductDiscount", arg.productDiscountId, error),
    }),
    getProductDiscounts: builder.query<ProductDiscountView[], GetProductDiscountsQuery>({
      query: (params) => ({
        url: "/productdiscounts",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("ProductDiscount", result, error),
    }),
    countProductDiscounts: builder.query<number, CountProductDiscountsQuery>({
      query: (params) => ({
        url: "/productdiscounts/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("ProductDiscount", error),
    }),
    createProductDiscount: builder.mutation<ProductDiscount, CreateProductDiscountCommand>({
      query: (body) => ({
        url: "/productdiscounts",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdProductDiscount } = await queryFulfilled;
          dispatch(
            productDiscountApi.util.upsertQueryData(
              "getProductDiscount",
              { productDiscountId: createdProductDiscount.id },
              createdProductDiscount,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("ProductDiscount", error),
        ...invalidatesCountTag("ProductDiscount", error),
      ],
    }),
    updateProductDiscount: builder.mutation<ProductDiscount, UpdateProductDiscountCommand>({
      query: (arg) => ({
        url: `/productdiscounts/${arg.id}`,
        method: "PUT",
        body: arg,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedProductDiscount } = await queryFulfilled;
          dispatch(
            productDiscountApi.util.upsertQueryData(
              "getProductDiscount",
              { productDiscountId: arg.id },
              updatedProductDiscount,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("ProductDiscount", arg.id, error),
    }),
    deleteProductDiscount: builder.mutation<void, DeleteProductDiscountCommand>({
      query: (arg) => ({
        url: `/productdiscounts/${arg.productDiscountId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, arg) => [
        ...invalidatesIdTag("ProductDiscount", arg.productDiscountId, error),
        ...invalidatesCountTag("ProductDiscount", error),
      ],
    }),
  }),
});

export default productDiscountApi;

export const {
  useGetProductDiscountQuery,
  useGetProductDiscountsQuery,
  useCountProductDiscountsQuery,
  useCreateProductDiscountMutation,
  useUpdateProductDiscountMutation,
  useDeleteProductDiscountMutation,
} = productDiscountApi;
