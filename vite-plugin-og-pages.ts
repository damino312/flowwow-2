import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { getBirthMonthsForOgPages } from "./src/const/shareOg";
import {
  buildOgPageContext,
  getVisiblePredictionDate,
  injectOpenGraphIntoHtml,
  joinSiteUrl,
  parseOgImageFromHtml,
  renderOgLandingPage,
} from "./lib/ogHtml";

type OgPagesPluginOptions = {
  siteUrl: string;
  base: string;
};

/** Статические HTML-страницы с OG для GitHub Pages и любого статического хостинга */
export function ogPagesPlugin(options: OgPagesPluginOptions): Plugin {
  const { siteUrl, base } = options;

  return {
    name: "og-pages",
    apply: "build",
    enforce: "post",
    closeBundle() {
      const outDir = join(process.cwd(), "dist");
      const indexHtml = readFileSync(join(outDir, "index.html"), "utf8");
      const ogImage = parseOgImageFromHtml(indexHtml);

      if (!ogImage) {
        console.warn(
          "[og-pages] og:image не найден в index.html — пропускаем генерацию /og/*",
        );
        return;
      }

      if (!siteUrl) {
        console.warn(
          "[og-pages] Задайте VITE_SITE_URL при сборке — абсолютные URL в OG могут быть неверными.",
        );
      }

      const resolvedSiteUrl = siteUrl || "https://example.com";
      const resultBaseUrl = joinSiteUrl(resolvedSiteUrl, base, "result");

      for (const month of getBirthMonthsForOgPages()) {
        const birthDate = `01.${month}.2000`;
        const pagePath = `og/${month}/`;
        const ctx = buildOgPageContext({
          siteUrl: resolvedSiteUrl,
          base,
          birthDate,
          pagePath,
          ...ogImage,
        });
        const predictionDate = getVisiblePredictionDate(month);
        const visibleDate = predictionDate
          ? `Пионы — ${predictionDate}.`
          : undefined;
        const pageHtml = renderOgLandingPage({
          ctx,
          resultBaseUrl,
          visibleDate,
        });
        const pageDir = join(outDir, "og", month);

        mkdirSync(pageDir, { recursive: true });
        writeFileSync(join(pageDir, "index.html"), pageHtml, "utf8");
      }

      const resultCtx = buildOgPageContext({
        siteUrl: resolvedSiteUrl,
        base,
        birthDate: "01.01.2000",
        pagePath: "result/",
        ...ogImage,
      });
      const resultDir = join(outDir, "result");

      mkdirSync(resultDir, { recursive: true });
      writeFileSync(
        join(resultDir, "index.html"),
        injectOpenGraphIntoHtml(indexHtml, resultCtx),
        "utf8",
      );
    },
  };
}
