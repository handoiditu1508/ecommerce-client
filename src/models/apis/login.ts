import User from "../entities/User";

export type LoginResponse = {
  expiration?: number;
  user?: User;
};
