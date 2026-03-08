import { GetNewProductsQuery } from "@/models/apis/product/getNewProducts";
import { ProductView } from "@/models/entities/Product";
import { providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const productApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewProducts: builder.query<ProductView[], GetNewProductsQuery>({
      query: (body) => `products/new?page=${body.page || ""}&pageSize=${body.pageSize || ""}`,
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
  }),
});

export default productApi;

export const {
  useGetNewProductsQuery,
  useLazyGetNewProductsQuery,
} = productApi;
