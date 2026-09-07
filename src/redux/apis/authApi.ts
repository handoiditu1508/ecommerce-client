import { ChangeEmailCommand } from "@/models/apis/auth/changeEmail";
import { ChangePasswordCommand } from "@/models/apis/auth/changePassword";
import { ConfirmChangeEmailCommand } from "@/models/apis/auth/confirmChangeEmail";
import { ForgotPasswordCommand, ForgotPasswordResponse } from "@/models/apis/auth/forgotPassword";
import { LoginCommand, LoginResponse } from "@/models/apis/auth/login";
import { Login2faCommand } from "@/models/apis/auth/login2fa";
import { LoginFacebookCommand } from "@/models/apis/auth/loginFacebook";
import { LoginGoogleCommand } from "@/models/apis/auth/loginGoogle";
import { RegisterConfirmedEmailCommand, RegisterResponse } from "@/models/apis/auth/registerConfirmedEmail";
import { ResetPasswordCommand } from "@/models/apis/auth/resetPassword";
import { SendPreConfirmEmailCommand } from "@/models/apis/auth/sendPreConfirmEmail";
import { Set2faCommand } from "@/models/apis/auth/set2fa";
import { SendEmailResponse } from "@/models/apis/common";
import User from "@/models/entities/User";
import appApi from "./appApi";

const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCommand>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/auth/refreshToken",
        method: "POST",
      }),
      invalidatesTags: (result) => (result ? ["UNAUTHORIZED"] : []),
    }),
    loginGoogle: builder.mutation<LoginResponse, LoginGoogleCommand>({
      query: (body) => ({
        url: "/auth/loginGoogle",
        method: "POST",
        body,
      }),
    }),
    loginFacebook: builder.mutation<LoginResponse, LoginFacebookCommand>({
      query: (body) => ({
        url: "/auth/loginFacebook",
        method: "POST",
        body,
      }),
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
    }),
    login2fa: builder.mutation<LoginResponse, Login2faCommand>({
      query: (body) => ({
        url: "/auth/login2fa",
        method: "POST",
        body,
      }),
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
    changeEmail: builder.mutation<SendEmailResponse, ChangeEmailCommand>({
      query: (body) => ({
        url: "/auth/changeEmail",
        method: "PUT",
        body,
      }),
    }),
    confirmChangeEmail: builder.mutation<void, ConfirmChangeEmailCommand>({
      query: (body) => ({
        url: `/auth/${body.userId}/confirmChangeEmail`,
        method: "PUT",
        body,
      }),
    }),
    changePassword: builder.mutation<User, ChangePasswordCommand>({
      query: (body) => ({
        url: "/auth/changePassword",
        method: "PUT",
        body,
      }),
    }),
    set2Fa: builder.mutation<User, Set2faCommand>({
      query: (body) => ({
        url: "/auth/2fa",
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
  useLoginGoogleMutation,
  useLoginFacebookMutation,
  useSendPreConfirmEmailMutation,
  useRegisterConfirmedEmailMutation,
  useLogin2faMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangeEmailMutation,
  useConfirmChangeEmailMutation,
  useChangePasswordMutation,
  useSet2FaMutation,
} = authApi;
