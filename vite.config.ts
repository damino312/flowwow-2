import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { ogPagesPlugin } from "./vite-plugin-og-pages";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, "") ?? "";
  const base = env.BASE_URL || "/";

  return {
    plugins: [
      react(),
      ogPagesPlugin({
        siteUrl,
        base,
      }),
    ],
  };
});
