import { CreateGiftCommand } from "@/models/apis/gift/createGift";
import { DeleteGiftCommand } from "@/models/apis/gift/deleteGift";
import { GetGiftQuery } from "@/models/apis/gift/getGift";
import { CountGiftsQuery, GetGiftsQuery } from "@/models/apis/gift/getGifts";
import { RecoverGiftCommand } from "@/models/apis/gift/recoverGift";
import { UpdateGiftCommand } from "@/models/apis/gift/updateGift";
import Gift, { GiftView } from "@/models/entities/Gift";
import { objectToFormData } from "../utils/formDataUtils";
import {
  invalidatesCountTag,
  invalidatesListTag,
  invalidatesPessimisticIdTag,
  providesCountTag,
  providesIdTag,
  providesListTags,
} from "../utils/rtkQueryTagUtils";
import appApi from "./appApi";

const giftApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getGift: builder.query<Gift, GetGiftQuery>({
      query: (arg) => ({
        url: `/gifts/${arg.giftId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("Gift", arg.giftId, error),
    }),
    getGifts: builder.query<GiftView[], GetGiftsQuery>({
      query: (params) => ({
        url: "/gifts",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("Gift", result, error),
    }),
    countGifts: builder.query<number, CountGiftsQuery>({
      query: (params) => ({
        url: "/gifts/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("Gift", error),
    }),
    createGift: builder.mutation<Gift, CreateGiftCommand>({
      query: (arg) => ({
        url: "/gifts",
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdGift } = await queryFulfilled;
          dispatch(
            giftApi.util.upsertQueryData(
              "getGift",
              { giftId: createdGift.id },
              createdGift,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("Gift", error),
        ...invalidatesCountTag("Gift", error),
      ],
    }),
    updateGift: builder.mutation<Gift, UpdateGiftCommand>({
      query: (arg) => ({
        url: `/gifts/${arg.id}`,
        method: "POST",
        body: objectToFormData(arg),
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedGift } = await queryFulfilled;
          dispatch(
            giftApi.util.upsertQueryData(
              "getGift",
              { giftId: arg.id },
              updatedGift,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("Gift", arg.id, error),
    }),
    deleteGift: builder.mutation<Gift | null, DeleteGiftCommand>({
      query: ({ giftId, ...arg }) => ({
        url: `/gifts/${giftId}`,
        method: "DELETE",
        params: arg,
      }),
      invalidatesTags: (_result, error) => invalidatesCountTag("Gift", error),
    }),
    recoverGift: builder.mutation<Gift, RecoverGiftCommand>({
      query: ({ giftId }) => ({
        url: `/gifts/${giftId}/recover`,
        method: "PUT",
      }),
      invalidatesTags: (_result, error) => invalidatesCountTag("Gift", error),
    }),
  }),
});

export default giftApi;

export const {
  useGetGiftQuery,
  useGetGiftsQuery,
  useLazyGetGiftsQuery,
  useCountGiftsQuery,
  useCreateGiftMutation,
  useUpdateGiftMutation,
  useDeleteGiftMutation,
  useRecoverGiftMutation,
} = giftApi;
