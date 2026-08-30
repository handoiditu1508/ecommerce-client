type ConfigType = {
  APP_NAME: string;
  /**
   * API base URL without slash suffix.
   */
  API_URL: string;
  /**
   * File base URL without slash suffix.
   */
  FILE_URL: string;
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
  ENTITY_NAME_MAX_LENGTH: number;
  USERNAME_MAX_LENGTH: number;
};

export default ConfigType;
