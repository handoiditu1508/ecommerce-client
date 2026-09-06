import ConfigType from "./ConfigType";

const defaultConfig: ConfigType = {
  APP_NAME: "React Template",
  API_URL: import.meta.env.VITE_API_URL,
  FILE_URL: import.meta.env.VITE_FILE_URL,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  IS_AWESOME: import.meta.env.VITE_IS_AWESOME === "true" ? true : false,
  LAYOUT_PADDING: 1,
  EMPTY_FUNCTION: () => { },
  EMPTY_OBJECT: {},
  EMPTY_ARRAY: [],
  NOTIFICATION_MESSAGE_TIMEOUT: 3000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 256,
  EMAIL_MAX_LENGTH: 256,
  NAME_MAX_LENGTH: 30,
  ENTITY_NAME_MAX_LENGTH: 256,
  USERNAME_MAX_LENGTH: 256,
};

export default defaultConfig;
