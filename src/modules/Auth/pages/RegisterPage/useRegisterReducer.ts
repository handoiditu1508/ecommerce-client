import { SendEmailResponse } from "@/models/apis/common";
import { useReducer } from "react";

export type RegisterReducerState = {
  email: string;
  cooldown: number;
};

export type RegisterReducerAction = {
  type: "SET_EMAIL";
  payload: string;
} | {
  type: "SET_COOLDOWN_FROM_RESPONSE";
  payload: SendEmailResponse;
} | {
  type: "DECREASE_COOLDOWN";
  payload: number;
};

const initialState: RegisterReducerState = {
  email: "",
  cooldown: 0,
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
        case "SET_COOLDOWN_FROM_RESPONSE":
          const finishCooldownTime = new Date(action.payload.sentTime);
          finishCooldownTime.setSeconds(finishCooldownTime.getSeconds() + action.payload.cooldown);
          const remainingCooldown = Math.max((finishCooldownTime.getTime() - Date.now()) / 1000, 0);

          return {
            ...state,
            cooldown: remainingCooldown,
          };
        case "DECREASE_COOLDOWN":
          return {
            ...state,
            cooldown: state.cooldown - action.payload,
          };
      }
    },
    initialState
  );

export default useRegisterReducer;
