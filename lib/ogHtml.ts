import { monthPrediction } from "../src/const/copyrights";
import {
  SHARE_OG_SITE_NAME,
  SHARE_OG_TITLE,
  buildShareOgDescription,
} from "../src/const/shareOg";

export type OgPageContext = {
  siteUrl: string;
  base: string;
  birthDate: string;
  pageUrl: string;
  imageUrl: string;
  imageWidth: string;
  imageHeight: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function joinSiteUrl(siteUrl: string, base: string, path: string): string {
  const basePath = base.endsWith("/") ? base : `${base}/`;
  const fullPath = `${basePath}${path.replace(/^\//, "")}`;
  const origin = siteUrl.replace(/\/$/, "");
  return new URL(fullPath, `${origin}/`).href;
}

export function buildOgPageContext(options: {
  siteUrl: string;
  base: string;
  birthDate: string;
  pagePath: string;
  imageUrl: string;
  imageWidth: string;
  imageHeight: string;
}): OgPageContext {
  const { siteUrl, base, birthDate, pagePath, imageUrl, imageWidth, imageHeight } =
    options;

  return {
    siteUrl,
    base,
    birthDate,
    pageUrl: joinSiteUrl(siteUrl, base, pagePath),
    imageUrl,
    imageWidth,
    imageHeight,
  };
}

export function parseOgImageFromHtml(html: string): {
  imageUrl: string;
  imageWidth: string;
  imageHeight: string;
} | null {
  const imageMatch = html.match(
    /<meta\s+property="og:image"\s+content="([^"]+)"/i,
  );
  if (!imageMatch?.[1]) return null;

  const widthMatch = html.match(
    /<meta\s+property="og:image:width"\s+content="([^"]+)"/i,
  );
  const heightMatch = html.match(
    /<meta\s+property="og:image:height"\s+content="([^"]+)"/i,
  );

  return {
    imageUrl: imageMatch[1],
    imageWidth: widthMatch?.[1] ?? "1200",
    imageHeight: heightMatch?.[1] ?? "630",
  };
}

export function renderOgHeadTags(ctx: OgPageContext): string {
  const description = buildShareOgDescription(ctx.birthDate);
  const title = escapeHtml(SHARE_OG_TITLE);
  const safeDescription = escapeHtml(description);
  const safeImageUrl = escapeHtml(ctx.imageUrl);
  const safePageUrl = escapeHtml(ctx.pageUrl);
  const safeSiteName = escapeHtml(SHARE_OG_SITE_NAME);

  return `
    <title>${title}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${safeSiteName}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:secure_url" content="${safeImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${ctx.imageWidth}" />
    <meta property="og:image:height" content="${ctx.imageHeight}" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta property="og:locale" content="ru_RU" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />`;
}

export function injectOpenGraphIntoHtml(
  html: string,
  ctx: OgPageContext,
): string {
  const tags = renderOgHeadTags(ctx);
  const withoutTitle = html.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
  const withoutOgImage = withoutTitle.replace(
    /<meta\s+property="og:image"[^>]*>\s*/gi,
    "",
  );
  const withoutOgImageMeta = withoutOgImage.replace(
    /<meta\s+property="og:image:[^"]+"[^>]*>\s*/gi,
    "",
  );

  if (!withoutOgImageMeta.includes("</head>")) {
    return html;
  }

  return withoutOgImageMeta.replace("</head>", `${tags}\n  </head>`);
}

export function renderOgLandingPage(options: {
  ctx: OgPageContext;
  resultBaseUrl: string;
  visibleDate?: string;
}): string {
  const { ctx, resultBaseUrl, visibleDate } = options;
  const headTags = renderOgHeadTags(ctx);
  const visible = visibleDate ?? "Узнай свой прогноз на Flowwow.";

  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${headTags}
  </head>
  <body>
    <main>
      <h1>${escapeHtml(SHARE_OG_TITLE)}</h1>
      <p>${escapeHtml(visible)}</p>
      <p><a id="open-result" href="${escapeHtml(resultBaseUrl)}">Открыть результат</a></p>
    </main>
    <script>
      (function () {
        var params = new URLSearchParams(location.search);
        var name = params.get("name") || "";
        var date = params.get("date") || "";
        var resultUrl = new URL(${JSON.stringify(resultBaseUrl)}, location.origin);
        if (name) resultUrl.searchParams.set("name", name);
        if (date) resultUrl.searchParams.set("date", date);
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

export function getVisiblePredictionDate(month: string): string | undefined {
  return monthPrediction(month)?.date;
}
