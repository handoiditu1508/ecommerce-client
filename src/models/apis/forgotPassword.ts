export type ForgotPasswordCommand = {
  /**
   * Username or email.
   */
  username: string;
};

export type ForgotPasswordResponse = {
  maskedEmail: string;
  maskedUsername: string;
  sentTime: string;
  cooldown: number;
};
