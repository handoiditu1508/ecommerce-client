import { ForgotPasswordCommand, ForgotPasswordResponse } from "@/models/apis/forgotPassword";
import { useReducer } from "react";

export type ForgotPasswordReducerState = {
  forgotPasswordCommand: ForgotPasswordCommand;
  emailSentTime: number;
  emailCooldown: number;
  emailCountdown: number;
};

export type ForgotPasswordReducerAction = {
  type: "SET_FORGOT_PASSWORD_COMMAND";
  payload: ForgotPasswordCommand;
} | {
  type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE";
  payload: Pick<ForgotPasswordResponse, "sentTime" | "cooldown">;
} | {
  type: "REFRESH_EMAIL_COUNTDOWN" | "RESET_EMAIL_COUNTDOWN";
};

const initialState: ForgotPasswordReducerState = {
  forgotPasswordCommand: {
    username: "",
  },
  emailSentTime: 0,
  emailCooldown: 0,
  emailCountdown: 0,
};

const useForgotPasswordReducer = () =>
  useReducer<ForgotPasswordReducerState, [ForgotPasswordReducerAction]>(
    (state, action) => {
      switch (action.type) {
        case "SET_FORGOT_PASSWORD_COMMAND":
          return {
            ...state,
            forgotPasswordCommand: action.payload,
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

export default useForgotPasswordReducer;
