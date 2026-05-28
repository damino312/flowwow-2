import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import reactOgImage from "vite-plugin-react-og-image";
import { resolveSiteUrl } from "./src/utils/resolveSiteUrl";
import { SHARE_OG_TITLE } from "./src/const/shareOg";
import { ogPagesPlugin } from "./vite-plugin-og-pages";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = resolveSiteUrl(env);
  const base = env.BASE_URL || "/";

  return {
    plugins: [
      react(),
      reactOgImage({
        host: siteUrl || "http://localhost:5173",
        alt: SHARE_OG_TITLE,
        imageResponseOptions: {
          width: 1200,
          height: 630,
        },
      }),
      ogPagesPlugin({
        siteUrl,
        base,
      }),
    ],
  };
});
