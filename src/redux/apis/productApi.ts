import { GetNewProductsQuery } from "@/models/apis/product/getNewProducts";
import { ProductView } from "@/models/entities/Product";
import { providesListTags } from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const productApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewProducts: builder.query<ProductView[], GetNewProductsQuery>({
      query: (arg) => {
        const searchParams = new URLSearchParams();
        if (arg.page) {
          searchParams.set("page", arg.page.toString());
        }
        if (arg.pageSize) {
          searchParams.set("pageSize", arg.pageSize.toString());
        }

        return "products/new?" + searchParams.toString();
      },
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
  }),
});

export default productApi;

export const {
  useGetNewProductsQuery,
  useLazyGetNewProductsQuery,
} = productApi;
