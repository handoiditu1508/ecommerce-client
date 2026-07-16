import User from "@/models/entities/User";

export type LoginCommand = {
  username: string;
  password: string;
  isPersistent: boolean;
};

export type LoginResponse = {
  expiration?: number;
  user?: User;
  refreshTokenExpiration?: number;
  twoFactorAuthenticate: boolean;
  sentTime: string;
  cooldown: number;
};
