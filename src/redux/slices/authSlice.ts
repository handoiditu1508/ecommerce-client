import SignInResponse from "@/models/apis/responses/SignInResponse";
import User from "@/models/entities/User";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";
import { RootState } from "../store";

export type AuthState = {
  expirationTime: number | null;// miliseconds
  user: User | null;
};

export const expirationTimeStorageKey = "expirationTime";

const initialState: AuthState = {
  expirationTime: null,
  user: null,
};

export const loadAuthStateFromLocalAsync = createAsyncThunk(
  "auth/loadAuthStateFromLocalAsync",
  async (_arg, thunkApi) => {
    const { auth: state } = thunkApi.getState() as RootState;

    state.expirationTime = Number(localStorage.getItem(expirationTimeStorageKey));

    // check token expired
    if (isNaN(state.expirationTime) || state.expirationTime <= Date.now()) {
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
    setAuthState: (state, action: PayloadAction<SignInResponse>) => {
      state.expirationTime = Date.parse(action.payload.expirationTime);
      localStorage.setItem(expirationTimeStorageKey, state.expirationTime.toString());
    },
    clearAuthState: (state) => {
      localStorage.removeItem(expirationTimeStorageKey);
      state.expirationTime = null;
    },
  },
});

export const {
  setAuthState,
  clearAuthState,
} = authSlice.actions;

export const selectIsSignedIn = (state: RootState): boolean => !!state.auth.expirationTime;
export const selectIsTokenExpired = (state: RootState): boolean => !!state.auth.expirationTime && state.auth.expirationTime <= Date.now();
export const selectExpirationTime = (state: RootState) => state.auth.expirationTime;
export const selectAuthUser = (state: RootState) => state.auth.user;

export default authSlice;
