import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import libs from "node-libs-browser";

// https://vitejs.dev/oldConfig/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 1337,
  },
  resolve: {
    alias: {
      // config: path.resolve(__dirname, "./oldConfig"),
      // redux: path.resolve(__dirname, "./src/app/redux"),
      enums: path.resolve(__dirname, "./src/app/enums"),
      helpers: path.resolve(__dirname, "./src/app/helpers"),
      models: path.resolve(__dirname, "./src/app/models"),
      services: path.resolve(__dirname, "./src/app/services"),
      shared: path.resolve(__dirname, "./src/app/shared"),
      oldConfig: path.resolve(__dirname, "./oldConfig"),
      newConfig: path.resolve(__dirname, "./newConfig"),
      util: libs.util,
    },
  },
});
