import { LoginResponse } from "@/models/apis/login";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { clearAuthState, selectRefreshTokenExpired, setAuthState } from "../slices/authSlice";
import { RootState } from "../store";

const mutex = new Mutex();

/**
 * Wrap `baseQuery` to automatically request for new token when current token is expired.
 * @param baseQuery `baseQuery` to be wrappped.
 * @returns Wrapped `baseQuery`.
 */
const reauthBaseQueryWrapper = <F extends BaseQueryFn<
  string | { url: string; method?: string; body?: any; },
  unknown,
  { status: number | string; }
>>(baseQuery: F): F => {
  const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    const state = api.getState() as RootState;

    // check response is unauthorized
    // check refresh token exist and not expired
    if (result.error && result.error.status === 401 && selectRefreshTokenExpired(state)) {
      // checking whether the mutex is unlocked
      if (!mutex.isLocked()) {
        // lock other requests until refresh token api returned
        const release = await mutex.acquire();

        const refreshResult = await baseQuery({ url: "refreshToken", method: "POST" }, api, extraOptions);

        if (refreshResult.data) {
          // store the new token info into store and local storage
          api.dispatch(setAuthState(refreshResult.data as LoginResponse));

          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        }

        // release must be called once the mutex should be released again.
        release();
      } else {
        // refresh token api already running

        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();

        // check expiration time to know if user token is stored in cookie or not
        if (state.auth.expiration) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        }
      }
    }

    if (result.error && result.error.status === 401) {
      api.dispatch(clearAuthState());
    }

    return result;
  };

  return baseQueryWithReauth as F;
};

export default reauthBaseQueryWrapper;
