import { LoginCommand, LoginResponse } from "@/models/apis/auth/login";
import { useReducer } from "react";

export type LoginReducerState = {
  loginCommand: LoginCommand;
  emailSentTime: number;
  emailCooldown: number;
  emailCountdown: number;
};

export type LoginReducerAction = {
  type: "SET_LOGIN_COMMAND";
  payload: LoginCommand;
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
