import Brand from "@/models/entities/Brand";
import { providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const brandApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopBrands: builder.query<Brand[], void>({
      query: () => "/brands/top",
      providesTags: (result, error) => providesListTags("Brand", result, error),
    }),
  }),
});

export default brandApi;

export const {
  useGetTopBrandsQuery,
} = brandApi;
