import { CreateBrandCommand } from "@/models/apis/brand/createBrand";
import { DeleteBrandCommand } from "@/models/apis/brand/deleteBrand";
import { GetBrandQuery } from "@/models/apis/brand/getBrand";
import { CountBrandsQuery, GetBrandsQuery } from "@/models/apis/brand/getBrands";
import { UpdateBrandCommand } from "@/models/apis/brand/updateBrand";
import Brand from "@/models/entities/Brand";
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

const brandApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<Brand[], void>({
      query: () => "/brands/all",
      keepUnusedDataFor: 300,
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
    getTopBrands: builder.query<Brand[], void>({
      query: () => "/brands/top",
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
    getBrandsHaveActiveProduct: builder.query<Brand[], void>({
      query: () => "/brands/activeproduct",
      keepUnusedDataFor: 300,
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
    getBrand: builder.query<Brand, GetBrandQuery>({
      query: (arg) => ({
        url: `/brands/${arg.brandId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("Brand", arg.brandId, error),
    }),
    getBrands: builder.query<Brand[], GetBrandsQuery>({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
    countBrands: builder.query<number, CountBrandsQuery>({
      query: (params) => ({
        url: "/brands/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("Brand", error),
    }),
    createBrand: builder.mutation<Brand, CreateBrandCommand>({
      query: (arg) => ({
        url: "/brands",
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdBrand } = await queryFulfilled;
          dispatch(
            brandApi.util.upsertQueryData(
              "getBrand",
              { brandId: createdBrand.id },
              createdBrand,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("Brand", error),
        ...invalidatesCountTag("Brand", error),
      ],
    }),
    updateBrand: builder.mutation<Brand, UpdateBrandCommand>({
      query: (arg) => ({
        url: `/brands/${arg.id}`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedBrand } = await queryFulfilled;
          dispatch(
            brandApi.util.upsertQueryData(
              "getBrand",
              { brandId: arg.id },
              updatedBrand,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Brand", arg.id, error),
    }),
    deleteBrand: builder.mutation<void, DeleteBrandCommand>({
      query: (arg) => ({
        url: `/brands/${arg.brandId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, arg) => invalidatesIdTag("Brand", arg.brandId, error),
    }),
  }),
});

export default brandApi;

export const {
  useGetAllBrandsQuery,
  useGetTopBrandsQuery,
  useGetBrandsHaveActiveProductQuery,
  useGetBrandQuery,
  useGetBrandsQuery,
  useCountBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
