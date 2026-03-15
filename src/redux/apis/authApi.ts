import { ForgotPasswordCommand, ForgotPasswordResponse } from "@/models/apis/auth/forgotPassword";
import { LoginCommand, LoginResponse } from "@/models/apis/auth/login";
import { Login2faCommand } from "@/models/apis/auth/login2fa";
import { RegisterConfirmedEmailCommand, RegisterResponse } from "@/models/apis/auth/registerConfirmedEmail";
import { ResetPasswordCommand } from "@/models/apis/auth/resetPassword";
import { SendPreConfirmEmailCommand } from "@/models/apis/auth/sendPreConfirmEmail";
import { SendEmailResponse } from "@/models/apis/common";
import { FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query";
import { clearAuthState, setAuthState } from "../slices/authSlice";
import appApi from "./appApi";

const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCommand>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setAuthState(response.data));
        } catch {
        }
      },
    }),
    refreshToken: builder.mutation<LoginResponse, void>({
      queryFn: async (arg, api, _extraOptions, baseQuery) => {
        const res = await baseQuery({
          url: "/auth/refreshToken",
          method: "POST",
          body: arg,
        }) as QueryReturnValue<LoginResponse, FetchBaseQueryError, FetchBaseQueryMeta>;

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
        url: "/auth/sendPreConfirmEmail",
        method: "POST",
        body,
      }),
    }),
    registerConfirmedEmail: builder.mutation<RegisterResponse, RegisterConfirmedEmailCommand>({
      query: (body) => ({
        url: "/auth/register/confirmedEmail",
        method: "POST",
        body,
      }),
      onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setAuthState(response.data));
        } catch {
        }
      },
    }),
    login2fa: builder.mutation<LoginResponse, Login2faCommand>({
      query: (body) => ({
        url: "/auth/login2fa",
        method: "POST",
        body,
      }),
      onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
        try {
          const response = await queryFulfilled;
          dispatch(setAuthState(response.data));
        } catch {
        }
      },
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordCommand>({
      query: (body) => ({
        url: "/auth/forgotPassword",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordCommand>({
      query: (body) => ({
        url: `/auth/${body.userId}/resetPassword`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export default authApi;

export const {
  useRefreshTokenMutation,
  useLoginMutation,
  useSendPreConfirmEmailMutation,
  useRegisterConfirmedEmailMutation,
  useLogin2faMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
