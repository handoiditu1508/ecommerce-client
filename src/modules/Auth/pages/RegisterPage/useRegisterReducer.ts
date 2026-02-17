import { useReducer } from "react";

export type RegisterReducerState = {
  email: string;
  cooldown: number;
};

export type RegisterReducerAction = {
  type: "SET_EMAIL";
  payload: string;
} | {
  type: "SET_COOLDOWN";
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
        case "SET_COOLDOWN":
          return {
            ...state,
            cooldown: action.payload,
          };
      }
    },
    initialState
  );

export default useRegisterReducer;
