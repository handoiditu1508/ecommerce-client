/// <reference types="vite/client" />

declare module "*.css";
declare module "swiper/css*";

interface ImportMetaEnv {
  readonly VITE_IS_AWESOME: string;
  readonly VITE_API_URL: string;
  readonly VITE_FILE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
