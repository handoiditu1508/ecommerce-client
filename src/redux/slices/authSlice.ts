import { LoginResponse } from "@/models/apis/auth/login";
import User from "@/models/entities/User";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";
import userApi from "../apis/userApi";
import { RootState } from "../store";

export type AuthState = {
  expiration: number | null;// miliseconds
  user: User | null;
  refreshTokenExpiration: number | null;// miliseconds
};

export const expirationStorageKey = "expiration";
export const refreshTokenExpirationStorageKey = "refreshTokenExpiration";

const initialState: AuthState = {
  expiration: null,
  user: null,
  refreshTokenExpiration: null,
};

export const loadAuthStateFromLocalAsync = createAsyncThunk(
  "auth/loadAuthStateFromLocalAsync",
  async (_arg, thunkApi) => {
    const { auth: state } = thunkApi.getState() as RootState;

    const expiration = Number(localStorage.getItem(expirationStorageKey));
    const refreshTokenExpiration = Number(localStorage.getItem(refreshTokenExpirationStorageKey));

    // check token expired
    if (expiration && expiration <= Date.now()) {
      // check refresh token expired
      if (refreshTokenExpiration && refreshTokenExpiration <= Date.now()) {
        thunkApi.dispatch(clearAuthState());
      } else {
        // call refresh token api
        const refreshTokenPromise = thunkApi.dispatch(authApi.endpoints.refreshToken.initiate());
        await refreshTokenPromise;
        refreshTokenPromise.reset();
      }
    } else {
      thunkApi.dispatch(setAuthExpiration(expiration));
      if (refreshTokenExpiration) {
        thunkApi.dispatch(setRefreshTokenExpiration(refreshTokenExpiration));
      }
      if (!state.user) {
        await thunkApi.dispatch(userApi.endpoints.getSelf.initiate());
      }
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

      return initialState;
    },
  },
});

export const {
  setAuthState,
  setAuthUser,
  setAuthExpiration,
  setRefreshTokenExpiration,
  clearAuthState,
} = authSlice.actions;

export const selectIsSignedIn = (state: RootState): boolean => !!state.auth.expiration;
export const selectIsTokenExpired = (state: RootState): boolean => !!state.auth.expiration && state.auth.expiration <= Date.now();
export const selectRefreshTokenExpired = (state: RootState) => !!state.auth.refreshTokenExpiration && state.auth.refreshTokenExpiration <= Date.now();
export const selectAuthExpiration = (state: RootState) => state.auth.expiration;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice;
