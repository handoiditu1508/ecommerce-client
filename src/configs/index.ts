import defaultConfig from "./config";
import type ConfigType from "./ConfigType";
import developmentConfig from "./development.config";
import productionConfig from "./production.config";
import testConfig from "./test.config";

const configMap: Record<string, Partial<ConfigType>> = {
  development: developmentConfig,
  production: productionConfig,
  test: testConfig,
};

const CONFIG: ConfigType = {
  ...defaultConfig,
  ...configMap[import.meta.env.MODE],
};

export { ConfigType };
export default CONFIG;
