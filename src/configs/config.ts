import ConfigType from "./ConfigType";

const defaultConfig: ConfigType = {
  APP_NAME: "React Template",
  IS_AWESOME: import.meta.env.VITE_IS_AWESOME === "true" ? true : false,
  LAYOUT_PADDING: 1,
  EMPTY_FUNCTION: () => { },
  EMPTY_OBJECT: {},
  EMPTY_ARRAY: [],
  NOTIFICATION_MESSAGE_TIMEOUT: 3000,
};

export default defaultConfig;
