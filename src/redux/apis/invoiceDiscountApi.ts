import { CreateInvoiceDiscountCommand } from "@/models/apis/invoiceDiscount/createInvoiceDiscount";
import { DeleteInvoiceDiscountCommand } from "@/models/apis/invoiceDiscount/deleteInvoiceDiscount";
import { GetInvoiceDiscountQuery } from "@/models/apis/invoiceDiscount/getInvoiceDiscount";
import { CountInvoiceDiscountsQuery, GetInvoiceDiscountsQuery } from "@/models/apis/invoiceDiscount/getInvoiceDiscounts";
import { UpdateInvoiceDiscountCommand } from "@/models/apis/invoiceDiscount/updateInvoiceDiscount";
import InvoiceDiscount, { InvoiceDiscountView } from "@/models/entities/InvoiceDiscount";
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

const invoiceDiscountApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvoiceDiscount: builder.query<InvoiceDiscount, GetInvoiceDiscountQuery>({
      query: (arg) => ({
        url: `/invoicediscounts/${arg.invoiceDiscountId}`,
        method: "GET",
      }),
      providesTags: (_result, error, arg) => providesIdTag("InvoiceDiscount", arg.invoiceDiscountId, error),
    }),
    getInvoiceDiscounts: builder.query<InvoiceDiscountView[], GetInvoiceDiscountsQuery>({
      query: (params) => ({
        url: "/invoicediscounts",
        method: "GET",
        params,
      }),
      providesTags: (result, error) => providesListTags("InvoiceDiscount", result, error),
    }),
    countInvoiceDiscounts: builder.query<number, CountInvoiceDiscountsQuery>({
      query: (params) => ({
        url: "/invoicediscounts/count",
        method: "GET",
        params,
      }),
      providesTags: (_result, error) => providesCountTag("InvoiceDiscount", error),
    }),
    createInvoiceDiscount: builder.mutation<InvoiceDiscount, CreateInvoiceDiscountCommand>({
      query: (body) => ({
        url: "/invoicediscounts",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: createdInvoiceDiscount } = await queryFulfilled;
          dispatch(
            invoiceDiscountApi.util.upsertQueryData(
              "getInvoiceDiscount",
              { invoiceDiscountId: createdInvoiceDiscount.id },
              createdInvoiceDiscount,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error) => [
        ...invalidatesListTag("InvoiceDiscount", error),
        ...invalidatesCountTag("InvoiceDiscount", error),
      ],
    }),
    updateInvoiceDiscount: builder.mutation<InvoiceDiscount, UpdateInvoiceDiscountCommand>({
      query: (arg) => ({
        url: `/invoicediscounts/${arg.id}`,
        method: "PUT",
        body: arg,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: updatedInvoiceDiscount } = await queryFulfilled;
          dispatch(
            invoiceDiscountApi.util.upsertQueryData(
              "getInvoiceDiscount",
              { invoiceDiscountId: arg.id },
              updatedInvoiceDiscount,
            ),
          );
        } catch {}
      },
      invalidatesTags: (_result, error, arg) => invalidatesPessimisticIdTag("InvoiceDiscount", arg.id, error),
    }),
    deleteInvoiceDiscount: builder.mutation<void, DeleteInvoiceDiscountCommand>({
      query: (arg) => ({
        url: `/invoicediscounts/${arg.invoiceDiscountId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, arg) => [
        ...invalidatesIdTag("InvoiceDiscount", arg.invoiceDiscountId, error),
        ...invalidatesCountTag("InvoiceDiscount", error),
      ],
    }),
  }),
});

export default invoiceDiscountApi;

export const {
  useGetInvoiceDiscountQuery,
  useGetInvoiceDiscountsQuery,
  useCountInvoiceDiscountsQuery,
  useCreateInvoiceDiscountMutation,
  useUpdateInvoiceDiscountMutation,
  useDeleteInvoiceDiscountMutation,
} = invoiceDiscountApi;
