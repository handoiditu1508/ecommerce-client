import { CreatePromotionBannerCommand } from "@/models/apis/promotionBanner/createPromotionBanner";
import { DeletePromotionBannerCommand } from "@/models/apis/promotionBanner/deletePromotionBanner";
import { GetPromotionBannerQuery } from "@/models/apis/promotionBanner/getPromotionBanner";
import { CountPromotionBannersQuery, GetPromotionBannersQuery } from "@/models/apis/promotionBanner/getPromotionBanners";
import { UpdatePromotionBannerCommand } from "@/models/apis/promotionBanner/updatePromotionBanner";
import PromotionBanner from "@/models/entities/PromotionBanner";
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

const promotionBannerApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromotionBanner: builder.query<PromotionBanner, GetPromotionBannerQuery>({
      query: (arg) => ({
        url: `/promotionbanners/${arg.promotionBannerId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("PromotionBanner", arg.promotionBannerId, error),
    }),
    getPromotionBanners: builder.query<PromotionBanner[], GetPromotionBannersQuery>({
      query: (params) => ({
        url: "/promotionbanners",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("PromotionBanner", result, error),
    }),
    countPromotionBanners: builder.query<number, CountPromotionBannersQuery>({
      query: (params) => ({
        url: "/promotionbanners/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("PromotionBanner", error),
    }),
    getActivePromotionBanners: builder.query<PromotionBanner[], void>({
      query: () => ({
        url: "/promotionbanners/active",
        method: "GET",
      }),
      providesTags: (result, error) => providesListTags("PromotionBanner", result, error),
    }),
    createPromotionBanner: builder.mutation<PromotionBanner, CreatePromotionBannerCommand>({
      query: (arg) => ({
        url: "/promotionbanners",
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdPromotionBanner } = await queryFulfilled;
          dispatch(
            promotionBannerApi.util.upsertQueryData(
              "getPromotionBanner",
              { promotionBannerId: createdPromotionBanner.id },
              createdPromotionBanner,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("PromotionBanner", error),
        ...invalidatesCountTag("PromotionBanner", error),
      ],
    }),
    updatePromotionBanner: builder.mutation<PromotionBanner, UpdatePromotionBannerCommand>({
      query: (arg) => ({
        url: `/promotionbanners/${arg.id}`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedPromotionBanner } = await queryFulfilled;
          dispatch(
            promotionBannerApi.util.upsertQueryData(
              "getPromotionBanner",
              { promotionBannerId: arg.id },
              updatedPromotionBanner,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("PromotionBanner", arg.id, error),
    }),
    deletePromotionBanner: builder.mutation<void, DeletePromotionBannerCommand>({
      query: (arg) => ({
        url: `/promotionbanners/${arg.promotionBannerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, arg) => [
        ...invalidatesIdTag("PromotionBanner", arg.promotionBannerId, error),
        ...invalidatesCountTag("PromotionBanner", error),
      ],
    }),
  }),
});

export default promotionBannerApi;

export const {
  useGetPromotionBannerQuery,
  useGetPromotionBannersQuery,
  useCountPromotionBannersQuery,
  useGetActivePromotionBannersQuery,
  useCreatePromotionBannerMutation,
  useUpdatePromotionBannerMutation,
  useDeletePromotionBannerMutation,
} = promotionBannerApi;
