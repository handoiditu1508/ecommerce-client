import { LoginResponse } from "./login";

export type RegisterConfirmedEmailCommand = {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  password: string;
  token: string;
};

export type RegisterResponse = LoginResponse & {
  sentTime: string;
  cooldown: number;
};
