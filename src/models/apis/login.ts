import User from "../entities/User";

export type LoginCommand = {
  username: string;
  password: string;
  isPersistent: boolean;
};

export type LoginResponse = {
  expiration?: number;
  user?: User;
  twoFactorAuthenticate: boolean;
};
