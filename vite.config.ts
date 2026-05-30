import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import ogPlugin from "vite-plugin-open-graph";
import { createResultOgOptions, getSiteOrigin } from "./og.config";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const siteOrigin = getSiteOrigin(env);

  return {
    plugins: [react(), ogPlugin(createResultOgOptions(siteOrigin))],
  };
});
