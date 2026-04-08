import Brand from "@/models/entities/Brand";
import { setAllBrands } from "../slices/brandsSlice";
import { providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const brandApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<Brand[], void>({
      query: () => "/brands/all",
      onCacheEntryAdded: async (arg, { cacheDataLoaded, dispatch }) => {
        try {
          const response = await cacheDataLoaded;
          dispatch(setAllBrands(response.data));
        } catch {}
      },
      keepUnusedDataFor: 300,
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
    getTopBrands: builder.query<Brand[], void>({
      query: () => "/brands/top",
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
  }),
});

export default brandApi;

export const {
  useGetAllBrandsQuery,
  useGetTopBrandsQuery,
} = brandApi;
