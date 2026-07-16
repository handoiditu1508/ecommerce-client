import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert(), // for https in development
  ],
  envDir: "environments",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src/"),

      },
    ],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
