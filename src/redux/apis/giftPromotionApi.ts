import { CreateGiftPromotionCommand } from "@/models/apis/giftPromotion/createGiftPromotion";
import { DeleteGiftPromotionCommand } from "@/models/apis/giftPromotion/deleteGiftPromotion";
import { GetGiftPromotionQuery } from "@/models/apis/giftPromotion/getGiftPromotion";
import { CountGiftPromotionsQuery, GetGiftPromotionsQuery } from "@/models/apis/giftPromotion/getGiftPromotions";
import { UpdateGiftPromotionCommand } from "@/models/apis/giftPromotion/updateGiftPromotion";
import { UpdateGiftPromotionGiftsCommand } from "@/models/apis/giftPromotion/updateGiftPromotionGifts";
import GiftPromotion, { GiftPromotionDetail, GiftPromotionView } from "@/models/entities/GiftPromotion";
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

const giftPromotionApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getGiftPromotion: builder.query<GiftPromotion, GetGiftPromotionQuery>({
      query: (arg) => ({
        url: `/giftpromotions/${arg.giftPromotionId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("GiftPromotion", arg.giftPromotionId, error),
    }),
    getGiftPromotions: builder.query<GiftPromotionView[], GetGiftPromotionsQuery>({
      query: (params) => ({
        url: "/giftpromotions",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("GiftPromotion", result, error),
    }),
    countGiftPromotions: builder.query<number, CountGiftPromotionsQuery>({
      query: (params) => ({
        url: "/giftpromotions/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("GiftPromotion", error),
    }),
    createGiftPromotion: builder.mutation<GiftPromotion, CreateGiftPromotionCommand>({
      query: (body) => ({
        url: "/giftpromotions",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdGiftPromotion } = await queryFulfilled;
          dispatch(
            giftPromotionApi.util.upsertQueryData(
              "getGiftPromotion",
              { giftPromotionId: createdGiftPromotion.id },
              createdGiftPromotion,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("GiftPromotion", error),
        ...invalidatesCountTag("GiftPromotion", error),
      ],
    }),
    updateGiftPromotion: builder.mutation<GiftPromotion, UpdateGiftPromotionCommand>({
      query: (arg) => ({
        url: `/giftpromotions/${arg.id}`,
        method: "PUT",
        body: arg,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedGiftPromotion } = await queryFulfilled;
          dispatch(
            giftPromotionApi.util.upsertQueryData(
              "getGiftPromotion",
              { giftPromotionId: arg.id },
              updatedGiftPromotion,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("GiftPromotion", arg.id, error),
    }),
    updateGiftPromotionGifts: builder.mutation<GiftPromotionDetail[], UpdateGiftPromotionGiftsCommand>({
      query: (arg) => ({
        url: `/giftpromotions/${arg.id}/gifts`,
        method: "PUT",
        body: arg,
      }),
      invalidatesTags: (_result, error, arg) => [
        ...invalidatesIdTag("GiftPromotion", arg.id, error),
        ...invalidatesPessimisticIdTag("GiftPromotion", arg.id, error),
      ],
    }),
    deleteGiftPromotion: builder.mutation<void, DeleteGiftPromotionCommand>({
      query: (arg) => ({
        url: `/giftpromotions/${arg.giftPromotionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, arg) => [
        ...invalidatesIdTag("GiftPromotion", arg.giftPromotionId, error),
        ...invalidatesCountTag("GiftPromotion", error),
      ],
    }),
  }),
});

export default giftPromotionApi;

export const {
  useGetGiftPromotionQuery,
  useGetGiftPromotionsQuery,
  useCountGiftPromotionsQuery,
  useCreateGiftPromotionMutation,
  useUpdateGiftPromotionMutation,
  useUpdateGiftPromotionGiftsMutation,
  useDeleteGiftPromotionMutation,
} = giftPromotionApi;
