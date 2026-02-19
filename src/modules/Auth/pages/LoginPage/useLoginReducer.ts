import { LoginCommand } from "@/models/apis/login";
import { useReducer } from "react";

export type LoginReducerState = {
  username: string;
  password: string;
  isPersistent: boolean;
};

export type LoginReducerAction = {
  type: "SET_FORM_STATE";
  payload: LoginCommand;
};

const initialState: LoginReducerState = {
  username: "",
  password: "",
  isPersistent: false,
};

const useLoginReducer = () =>
  useReducer<LoginReducerState, [LoginReducerAction]>(
    (state, action) => {
      switch (action.type) {
        case "SET_FORM_STATE":
          return {
            ...state,
            username: action.payload.username,
            password: action.payload.password,
            isPersistent: action.payload.isPersistent,
          };
      }
    },
    initialState
  );

export default useLoginReducer;
