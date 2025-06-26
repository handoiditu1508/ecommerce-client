import SignInResponse from "@/models/apis/responses/SignInResponse";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { clearAuthState, expirationTimeStorageKey, setAuthState } from "../slices/authSlice";

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

    // check response is unauthorized
    if (result.error && result.error.status === 401 && localStorage.getItem(expirationTimeStorageKey)) {
      // checking whether the mutex is unlocked
      if (!mutex.isLocked()) {
        // lock other requests until refresh token api returned
        const release = await mutex.acquire();

        const refreshResult = await baseQuery({ url: "refreshToken", method: "POST" }, api, extraOptions);

        if (refreshResult.data) {
          // store the new token info into store and local storage
          api.dispatch(setAuthState(refreshResult.data as SignInResponse));

          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearAuthState());
        }

        // release must be called once the mutex should be released again.
        release();
      } else {
        // refresh token api already running

        // wait until the mutex is available without locking it
        await mutex.waitForUnlock();

        // check expiration time to know if user token is stored in cookie or not
        if (localStorage.getItem(expirationTimeStorageKey)) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        }
      }
    }

    return result;
  };

  return baseQueryWithReauth as F;
};

export default reauthBaseQueryWrapper;
