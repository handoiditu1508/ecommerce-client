import CONFIG from "@/configs";
import { LoginResponse } from "@/models/apis/auth/login";
import User from "@/models/entities/User";
import Policy from "@/models/Policy";
import { PayloadAction, createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";
import userApi from "../apis/userApi";
import { RootState } from "../store";

export type AuthState = {
  expiration: number | null;// miliseconds
  user: User | null;
  refreshTokenExpiration: number | null;// miliseconds
  loading: boolean;
};

export const expirationStorageKey = "expiration";
export const refreshTokenExpirationStorageKey = "refreshTokenExpiration";

const initialState: AuthState = {
  expiration: null,
  user: null,
  refreshTokenExpiration: null,
  loading: true, // init as true to prevent premature redirect when auth state is not yet loaded from local
};

export const loadAuthStateFromLocalAsync = createAsyncThunk(
  "auth/loadAuthStateFromLocalAsync",
  async (_arg, thunkApi) => {
    const { auth: state } = thunkApi.getState() as RootState;

    const expiration = Number(localStorage.getItem(expirationStorageKey));
    const isAccessTokenValid = !!expiration && expiration > Date.now();
    const refreshTokenExpiration = Number(localStorage.getItem(refreshTokenExpirationStorageKey));
    const isRefreshTokenValid = !!refreshTokenExpiration && refreshTokenExpiration > Date.now();

    if (isRefreshTokenValid) {
      thunkApi.dispatch(setRefreshTokenExpiration(refreshTokenExpiration));
    }

    if (isAccessTokenValid) {
      thunkApi.dispatch(setAuthExpiration(expiration));
      if (!state.user) {
        await thunkApi.dispatch(userApi.endpoints.getSelf.initiate());
      }
    } else if (isRefreshTokenValid) {
      // call refresh token api
      const refreshTokenPromise = thunkApi.dispatch(authApi.endpoints.refreshToken.initiate());
      await refreshTokenPromise;
      refreshTokenPromise.reset();
    } else {
      thunkApi.dispatch(clearAuthState());
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<LoginResponse>) => {
      if (action.payload.expiration) {
        state.expiration = action.payload.expiration;
        localStorage.setItem(expirationStorageKey, state.expiration.toString());
      }
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      if (action.payload.refreshTokenExpiration) {
        state.refreshTokenExpiration = action.payload.refreshTokenExpiration;
        localStorage.setItem(refreshTokenExpirationStorageKey, state.refreshTokenExpiration.toString());
      }
    },
    setAuthUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAuthExpiration: (state, action: PayloadAction<number>) => {
      state.expiration = action.payload;
      localStorage.setItem(expirationStorageKey, state.expiration.toString());
    },
    setRefreshTokenExpiration: (state, action: PayloadAction<number>) => {
      state.refreshTokenExpiration = action.payload;
      localStorage.setItem(refreshTokenExpirationStorageKey, state.refreshTokenExpiration.toString());
    },
    // use this to logout
    clearAuthState: () => {
      localStorage.removeItem(expirationStorageKey);
      localStorage.removeItem(refreshTokenExpirationStorageKey);

      return {
        ...initialState,
        loading: false,

      };
    },
    updateAuthUserEmail: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.email = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAuthStateFromLocalAsync.pending, (state) => {
        state.loading = true;
      })
      .addMatcher(
        isAnyOf(
          loadAuthStateFromLocalAsync.fulfilled,
          loadAuthStateFromLocalAsync.rejected
        ),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          authApi.endpoints.login.matchFulfilled,
          authApi.endpoints.refreshToken.matchFulfilled,
          authApi.endpoints.registerConfirmedEmail.matchFulfilled,
          authApi.endpoints.login2fa.matchFulfilled
        ),
        (state: AuthState, action: PayloadAction<LoginResponse>) => {
          const newAction = authSlice.actions.setAuthState(action.payload);
          authSlice.caseReducers.setAuthState(state, newAction);
        }
      )
      .addMatcher(
        authApi.endpoints.refreshToken.matchRejected,
        (state, action) => {
          if (action.payload?.status === 401) {
            authSlice.caseReducers.clearAuthState();
          }
        }
      )
      .addMatcher(
        isAnyOf(
          userApi.endpoints.getSelf.matchFulfilled,
          userApi.endpoints.updateSelf.matchFulfilled,
          authApi.endpoints.changePassword.matchFulfilled,
          authApi.endpoints.set2Fa.matchFulfilled
        ),
        (state: AuthState, action: PayloadAction<User>) => {
          const newAction = authSlice.actions.setAuthUser(action.payload);
          authSlice.caseReducers.setAuthUser(state, newAction);
        }
      )
      .addMatcher(authApi.endpoints.confirmChangeEmail.matchFulfilled, (state, action) => {
        if (state.user && state.user.id === action.meta.arg.originalArgs.userId) {
          state.user.email = action.meta.arg.originalArgs.newEmail;
        }
      });
  },
});

export const {
  setAuthState,
  setAuthUser,
  setAuthExpiration,
  setRefreshTokenExpiration,
  clearAuthState,
  updateAuthUserEmail,
} = authSlice.actions;

export const authSelectors = {
  signedIn: (state: RootState): boolean => !!state.auth.expiration,
  tokenExpired: (state: RootState): boolean => !!state.auth.expiration && state.auth.expiration <= Date.now(),
  refreshTokenExpired: (state: RootState) => !!state.auth.refreshTokenExpiration && state.auth.refreshTokenExpiration <= Date.now(),
  expiration: (state: RootState) => state.auth.expiration,
  user: (state: RootState) => state.auth.user,
  policies: (state: RootState) => state.auth.user?.policies ?? CONFIG.EMPTY_ARRAY,
  loading: (state: RootState) => state.auth.loading,
  authorizedFor: (...policies: Policy[]) => (state: RootState) => (state.auth.user ? policies.every((policy) => state.auth.user!.policies.includes(policy)) : false),
};

export default authSlice;
