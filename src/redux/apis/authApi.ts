import { LoginResponse } from "@/models/apis/login";
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
  }),
});

export default authApi;

export const {
  useRefreshTokenMutation,
} = authApi;
