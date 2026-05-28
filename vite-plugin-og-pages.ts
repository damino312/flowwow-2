import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { monthPrediction } from "./src/const/copyrights";
import {
  SHARE_OG_SITE_NAME,
  SHARE_OG_TITLE,
  buildShareOgDescription,
  getBirthMonthsForOgPages,
} from "./src/const/shareOg";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function joinUrl(siteUrl: string, base: string, path: string): string {
  const normalizedSite = siteUrl.replace(/\/$/, "");
  const normalizedBase = base.startsWith("/") ? base : `/${base}`;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedSite}${normalizedBase}${normalizedPath}`.replace(
    /([^:]\/)\/+/g,
    "$1",
  );
}

function renderOgPage(options: {
  month: string;
  predictionDate?: string;
  siteUrl: string;
  base: string;
}): string {
  const { month, predictionDate, siteUrl, base } = options;
  const birthDate = `01.${month}.2000`;
  const description = buildShareOgDescription(birthDate);
  const pageUrl = joinUrl(siteUrl, base, `og/${month}/`);
  const imageUrl = joinUrl(siteUrl, base, "og-share.png");
  const resultBase = joinUrl(siteUrl, base, "result");

  const visibleDate = predictionDate
    ? `Пионы — ${predictionDate}.`
    : "Узнай свой прогноз на Flowwow.";

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(SHARE_OG_TITLE)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(SHARE_OG_SITE_NAME)}" />
    <meta property="og:title" content="${escapeHtml(SHARE_OG_TITLE)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeHtml(SHARE_OG_TITLE)}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
    <meta property="og:locale" content="ru_RU" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(SHARE_OG_TITLE)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  </head>
  <body>
    <main>
      <h1>${escapeHtml(SHARE_OG_TITLE)}</h1>
      <p>${escapeHtml(visibleDate)}</p>
      <p><a id="open-result" href="${escapeHtml(resultBase)}">Открыть результат</a></p>
    </main>
    <script>
      (function () {
        var params = new URLSearchParams(location.search);
        var name = params.get("name") || "";
        var date = params.get("date") || "";
        var resultUrl = new URL(${JSON.stringify(resultBase)}, location.origin);
        resultUrl.searchParams.set("name", name);
        resultUrl.searchParams.set("date", date);
        var link = document.getElementById("open-result");
        if (link) link.href = resultUrl.pathname + resultUrl.search;

        var bot = /bot|crawl|slurp|spider|mediapartners|facebookexternalhit|whatsapp|telegram|vkshare|twitterbot|linkedinbot/i.test(
          navigator.userAgent,
        );
        if (!bot && name && date) location.replace(link.href);
      })();
    </script>
  </body>
</html>`;
}

type OgPagesPluginOptions = {
  siteUrl: string;
  base: string;
};

export function ogPagesPlugin(options: OgPagesPluginOptions): Plugin {
  return {
    name: "og-pages",
    closeBundle() {
      const { siteUrl, base } = options;

      if (!siteUrl) {
        console.warn(
          "[og-pages] VITE_SITE_URL is not set — Open Graph image URLs may be invalid in production.",
        );
      }

      const outputRoot = join(process.cwd(), "dist");
      const resolvedSiteUrl = siteUrl || "http://localhost:4173";

      for (const month of getBirthMonthsForOgPages()) {
        const predictionDate = monthPrediction(month)?.date;
        const html = renderOgPage({
          month,
          predictionDate,
          siteUrl: resolvedSiteUrl,
          base,
        });
        const dir = join(outputRoot, "og", month);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), html, "utf8");
      }
    },
  };
}
