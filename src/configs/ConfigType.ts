type ConfigType = {
  APP_NAME: string;
  IS_AWESOME: boolean;
  /**
   * theme.spacing(CONFIG.LAYOUT_PADDING)
   */
  LAYOUT_PADDING: number;
  EMPTY_FUNCTION: () => void;
  EMPTY_OBJECT: {};
  EMPTY_ARRAY: [];
  /**
   * miliseconds
   */
  NOTIFICATION_MESSAGE_TIMEOUT: number;
  PASSWORD_MIN_LENGTH: number;
  PASSWORD_MAX_LENGTH: number;
  EMAIL_MAX_LENGTH: number;
  NAME_MAX_LENGTH: number;
};

export default ConfigType;
