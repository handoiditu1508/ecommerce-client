import { SendEmailResponse } from "@/models/apis/common";
import { LoginResponse } from "@/models/apis/login";
import { SendPreConfirmEmailCommand } from "@/models/apis/sendPreConfirmEmail";
import { FetchBaseQueryError, QueryReturnValue } from "@reduxjs/toolkit/query";
import { clearAuthState, setAuthState } from "../slices/authSlice";
import appApi from "./appApi";

const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<LoginResponse, void>({
      queryFn: async (arg, api, _extraOptions, baseQuery) => {
        const res = await baseQuery({
          url: "refreshToken",
          method: "POST",
          body: arg,
        }) as QueryReturnValue<LoginResponse, FetchBaseQueryError, {} | undefined>;

        if (res.data) {
          api.dispatch(setAuthState(res.data));
        } else if (res.error.status === 401) {
          api.dispatch(clearAuthState());
        }

        return res;
      },
      invalidatesTags: (result) => (result ? ["UNAUTHORIZED"] : []),
    }),
    sendPreConfirmEmail: builder.mutation<SendEmailResponse, SendPreConfirmEmailCommand>({
      query: (body) => ({
        url: "auth/sendPreConfirmEmail",
        method: "POST",
        body,
      }),
    }),
  }),
});

export default authApi;

export const {
  useRefreshTokenMutation,
  useSendPreConfirmEmailMutation,
} = authApi;
