export type ResetPasswordCommand = {
  userId: number;
  token: string;
  newPassword: string;
};
