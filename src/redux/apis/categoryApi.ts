import Category from "@/models/entities/Category";
import { providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const categoryApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryTrees: builder.query<Category[], void>({
      query: () => "/categories/trees",
      keepUnusedDataFor: 300,
      providesTags: (result, error) => providesListTags("Category", result, error, (r) => r.children),
    }),
  }),
});

export default categoryApi;

export const {
  useGetCategoryTreesQuery,
} = categoryApi;
