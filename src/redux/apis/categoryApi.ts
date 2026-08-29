import { CreateCategoryCommand } from "@/models/apis/category/createCategory";
import { DeleteCategoryCommand } from "@/models/apis/category/deleteCategory";
import { CountCategoriesQuery, GetCategoriesQuery } from "@/models/apis/category/getCategories";
import { GetCategoryQuery } from "@/models/apis/category/getCategory";
import { UpdateCategoryCommand } from "@/models/apis/category/updateCategory";
import Category, { CategoryView } from "@/models/entities/Category";
import { objectToFormData } from "../utils/formDataUtils";
import { invalidatesCountTag, invalidatesIdTag, invalidatesListTag, invalidatesPessimisticIdTag, providesCountTag, providesIdTag, providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const categoryApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryTrees: builder.query<Category[], void>({
      query: () => "/categories/trees",
      keepUnusedDataFor: 300,
      providesTags: (result, error) => providesListTags("Category", result, error, (r) => r.children),
    }),
    getCategory: builder.query<Category, GetCategoryQuery>({
      query: (arg) => ({
        url: `/categories/${arg.categoryId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("Category", arg.categoryId, error),
    }),
    getCategories: builder.query<CategoryView[], GetCategoriesQuery>({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("Category", result, error),
    }),
    countCategories: builder.query<number, CountCategoriesQuery>({
      query: (params) => ({
        url: "/categories/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("Category", error),
    }),
    createCategory: builder.mutation<Category, CreateCategoryCommand>({
      query: (arg) => ({
        url: "/categories",
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdCategory } = await queryFulfilled;
          dispatch(
            categoryApi.util.upsertQueryData(
              "getCategory",
              { categoryId: createdCategory.id },
              createdCategory,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("Category", error),
        ...invalidatesCountTag("Category", error),
      ],
    }),
    updateCategory: builder.mutation<Category, UpdateCategoryCommand>({
      query: (arg) => ({
        url: `/categories/${arg.id}`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedCategory } = await queryFulfilled;
          dispatch(
            categoryApi.util.upsertQueryData(
              "getCategory",
              { categoryId: arg.id },
              updatedCategory,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Category", arg.id, error),
    }),
    deleteCategory: builder.mutation<void, DeleteCategoryCommand>({
      query: (arg) => ({
        url: `/categories/${arg.categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, arg) => invalidatesIdTag("Category", arg.categoryId, error),
    }),
  }),
});

export default categoryApi;

export const {
  useGetCategoryTreesQuery,
  useGetCategoryQuery,
  useGetCategoriesQuery,
  useCountCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
