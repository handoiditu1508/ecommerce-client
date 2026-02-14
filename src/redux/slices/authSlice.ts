import { LoginResponse } from "@/models/apis/login";
import User from "@/models/entities/User";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";
import { RootState } from "../store";

export type AuthState = {
  expiration: number | null;// miliseconds
  user: User | null;
};

export const expirationStorageKey = "expiration";

const initialState: AuthState = {
  expiration: null,
  user: null,
};

export const loadAuthStateFromLocalAsync = createAsyncThunk(
  "auth/loadAuthStateFromLocalAsync",
  async (_arg, thunkApi) => {
    const { auth: state } = thunkApi.getState() as RootState;

    state.expiration = Number(localStorage.getItem(expirationStorageKey));

    // check token expired
    if (isNaN(state.expiration) || state.expiration <= Date.now()) {
      // call refresh token api
      const refreshTokenPromise = thunkApi.dispatch(authApi.endpoints.refreshToken.initiate());
      await refreshTokenPromise;
      refreshTokenPromise.reset();
    } else if (!state.user) {
      // todo: load signed in user details from BE
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
    },
    clearAuthState: (state) => {
      localStorage.removeItem(expirationStorageKey);
      state.expiration = null;
    },
  },
});

export const {
  setAuthState,
  clearAuthState,
} = authSlice.actions;

export const selectIsSignedIn = (state: RootState): boolean => !!state.auth.expiration;
export const selectIsTokenExpired = (state: RootState): boolean => !!state.auth.expiration && state.auth.expiration <= Date.now();
export const selectExpiration = (state: RootState) => state.auth.expiration;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice;
