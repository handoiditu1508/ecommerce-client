export type ConfirmChangeEmailCommand = {
  userId: number;
  newEmail: string;
  token: string;
};
