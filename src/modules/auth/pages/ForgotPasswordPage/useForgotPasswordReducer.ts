import { ForgotPasswordCommand, ForgotPasswordResponse } from "@/models/apis/auth/forgotPassword";
import { ResetPasswordCommand } from "@/models/apis/auth/resetPassword";
import { useReducer } from "react";

export type ForgotPasswordReducerState = {
  forgotPasswordCommand: ForgotPasswordCommand;
  emailSentTime: number;
  emailCooldown: number;
  emailCountdown: number;
  resetPasswordCommand: ResetPasswordCommand;
  maskedEmail: string;
};

export type ForgotPasswordReducerAction = {
  type: "SET_FORGOT_PASSWORD_COMMAND";
  payload: ForgotPasswordCommand;
} | {
  type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE";
  payload: Pick<ForgotPasswordResponse, "sentTime" | "cooldown">;
} | {
  type: "REFRESH_EMAIL_COUNTDOWN" | "RESET_EMAIL_COUNTDOWN";
} | {
  type: "SET_RESET_PASSWORD_COMMAND";
  payload: ResetPasswordCommand;
} | {
  type: "SET_MASKED_EMAIL";
  payload: string;
};

const initialState: ForgotPasswordReducerState = {
  forgotPasswordCommand: {
    username: "",
  },
  emailSentTime: 0,
  emailCooldown: 0,
  emailCountdown: 0,
  resetPasswordCommand: {
    userId: 0,
    token: "",
    newPassword: "",
  },
  maskedEmail: "",
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
        case "SET_RESET_PASSWORD_COMMAND":
          return {
            ...state,
            resetPasswordCommand: action.payload,
          };
        case "SET_MASKED_EMAIL":
          return {
            ...state,
            maskedEmail: action.payload,
          };
      }
    },
    initialState
  );

export default useForgotPasswordReducer;
