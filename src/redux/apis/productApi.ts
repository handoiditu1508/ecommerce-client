import { GetDiscountedProductsQuery } from "@/models/apis/product/getDiscountedProducts";
import { GetNewProductsQuery } from "@/models/apis/product/getNewProducts";
import { ProductView } from "@/models/entities/Product";
import { providesCountTag, providesListTags } from "../utils/rtkQueryTagUtils";
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

        return "/products/new?" + searchParams.toString();
      },
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
    getDiscountedProducts: builder.query<ProductView[], GetDiscountedProductsQuery>({
      query: (arg) => {
        const searchParams = new URLSearchParams();
        if (arg.page) {
          searchParams.set("page", arg.page.toString());
        }
        if (arg.pageSize) {
          searchParams.set("pageSize", arg.pageSize.toString());
        }

        return "/products/discount?" + searchParams.toString();
      },
      providesTags: (result, error) => providesListTags("Product", result, error),
    }),
    countAllProducts: builder.query<number, void>({
      query: () => "/products/count/all",
      providesTags: (_result, error) => providesCountTag("Product", error),
    }),
    countDiscountedProducts: builder.query<number, void>({
      query: () => "/products/count/discount",
      providesTags: (_result, error) => providesCountTag("Product", error),
    }),
  }),
});

export default productApi;

export const {
  useGetNewProductsQuery,
  useLazyGetNewProductsQuery,
  useCountAllProductsQuery,
  useLazyCountAllProductsQuery,
  useGetDiscountedProductsQuery,
  useLazyGetDiscountedProductsQuery,
  useCountDiscountedProductsQuery,
  useLazyCountDiscountedProductsQuery,
} = productApi;
