import { GetBrandQuery } from "@/models/apis/brand/getBrand";
import { CountBrandsQuery, GetBrandsQuery } from "@/models/apis/brand/getBrands";
import Brand from "@/models/entities/Brand";
import { providesCountTag, providesIdTag, providesListTags } from "../utils/rtkQueryTagUtils";
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
} = brandApi;
