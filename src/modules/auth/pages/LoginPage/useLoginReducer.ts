import { LoginCommand, LoginResponse } from "@/models/apis/auth/login";
import { useReducer } from "react";

export type LoginMethod = "password" | "google";

export type LoginReducerState = {
  loginCommand: LoginCommand;
  loginMethod: LoginMethod;
  emailSentTime: number;
  emailCooldown: number;
  emailCountdown: number;
};

export type LoginReducerAction = {
  type: "SET_LOGIN_COMMAND";
  payload: LoginCommand;
} | {
  type: "SET_GOOGLE_LOGIN_USERNAME";
  // Google account's verified email, used as the "username" for the follow-up Login2fa step.
  payload: string;
} | {
  type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE";
  payload: Pick<LoginResponse, "sentTime" | "cooldown">;
} | {
  type: "REFRESH_EMAIL_COUNTDOWN" | "RESET_EMAIL_COUNTDOWN";
};

const initialState: LoginReducerState = {
  loginCommand: {
    username: "",
    password: "",
    isPersistent: false,
  },
  loginMethod: "password",
  emailSentTime: 0,
  emailCooldown: 0,
  emailCountdown: 0,
};

const useLoginReducer = () =>
  useReducer<LoginReducerState, [LoginReducerAction]>(
    (state, action) => {
      switch (action.type) {
        case "SET_LOGIN_COMMAND":
          return {
            ...state,
            loginCommand: action.payload,
            loginMethod: "password",
          };
        case "SET_GOOGLE_LOGIN_USERNAME":
          return {
            ...state,
            loginCommand: {
              ...state.loginCommand,
              username: action.payload,
            },
            loginMethod: "google",
          };
        case "SET_EMAIL_COUNTDOWN_FROM_RESPONSE":
          const sentTimeMilis = Date.parse(action.payload.sentTime);
          const nowMilis = Date.now();

          const elapsed = (nowMilis - sentTimeMilis) / 1000;
          const remainingCountdown = Math.max(0, Math.ceil(action.payload.cooldown - elapsed));

          return {
            ...state,
            emailSentTime: sentTimeMilis,
            emailCooldown: action.payload.cooldown,
            emailCountdown: remainingCountdown,
          };
        case "REFRESH_EMAIL_COUNTDOWN": {
          const nowMilis = Date.now();
          const elapsed = (nowMilis - state.emailSentTime) / 1000;
          const remainingCountdown = Math.max(0, Math.ceil(state.emailCooldown - elapsed));

          return {
            ...state,
            emailCountdown: remainingCountdown,
          };
        }
        case "RESET_EMAIL_COUNTDOWN":
          return {
            ...state,
            emailSentTime: initialState.emailSentTime,
            emailCooldown: initialState.emailCooldown,
            emailCountdown: initialState.emailCountdown,
          };
      }
    },
    initialState
  );

export default useLoginReducer;
