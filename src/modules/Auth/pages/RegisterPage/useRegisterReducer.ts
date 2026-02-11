import { useReducer } from "react";

export type RegisterReducerState = {
  email: string;
};

export type RegisterReducerAction = {
  type: "SET_EMAIL";
  payload: string;
};

const initialState: RegisterReducerState = {
  email: "",
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
      }
    },
    initialState
  );

export default useRegisterReducer;
