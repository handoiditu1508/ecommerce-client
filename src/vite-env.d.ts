/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_AWESOME: string;
  readonly VITE_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
