import SignInResponse from "@/models/apis/responses/SignInResponse";
import { FetchBaseQueryError, QueryReturnValue } from "@reduxjs/toolkit/query";
import { clearAuthState, setAuthState } from "../slices/authSlice";
import appApi from "./appApi";

const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshToken: builder.mutation<SignInResponse, void>({
      queryFn: async (arg, api, _extraOptions, baseQuery) => {
        const res = await baseQuery({
          url: "refreshToken",
          method: "POST",
          body: arg,
        }) as QueryReturnValue<SignInResponse, FetchBaseQueryError, {} | undefined>;

        if (res.data) {
          api.dispatch(setAuthState(res.data));
        } else if (res.error.status === 401) {
          api.dispatch(clearAuthState());
        }

        return res;
      },
      invalidatesTags: (result) => (result ? ["UNAUTHORIZED"] : []),
    }),
  }),
});

export default authApi;

export const {
  useRefreshTokenMutation,
} = authApi;
