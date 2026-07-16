import { SendEmailResponse } from "@/models/apis/common";
import { useReducer } from "react";

export type RegisterReducerState = {
  email: string;
  emailSentTime: number;
  emailCooldown: number;
  emailCountdown: number;
  token: string;
};

export type RegisterReducerAction = {
  type: "SET_EMAIL" | "SET_TOKEN";
  payload: string;
} | {
  type: "SET_EMAIL_COUNTDOWN_FROM_RESPONSE";
  payload: Pick<SendEmailResponse, "sentTime" | "cooldown">;
} | {
  type: "REFRESH_EMAIL_COUNTDOWN" | "RESET_EMAIL_COUNTDOWN";
};

const initialState: RegisterReducerState = {
  email: "",
  emailSentTime: 0,
  emailCooldown: 0,
  emailCountdown: 0,
  token: "",
};

const useRegisterReducer = () =>
  useReducer<RegisterReducerState, [RegisterReducerAction]>(
    (state, action) => {
      switch (action.type) {
        case "SET_EMAIL":
          return {
            ...state,
            email: action.payload,
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
        case "SET_TOKEN":
          return {
            ...state,
            token: action.payload,
          };
      }
    },
    initialState
  );

export default useRegisterReducer;
