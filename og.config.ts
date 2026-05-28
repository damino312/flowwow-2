import type { Options } from "vite-plugin-open-graph";
import {
  RESULT_SHARE_DESCRIPTION,
  RESULT_SHARE_TITLE,
} from "./src/constants/share";

export function getSiteOrigin(env: Record<string, string>): string {
  return env.VITE_SITE_ORIGIN?.replace(/\/$/, "");
}

export function createResultOgOptions(siteOrigin: string): Options {
  const resultUrl = `${siteOrigin}/result`;
  const imageUrl = `${siteOrigin}/og.png`;

  const title = RESULT_SHARE_TITLE;
  const description = RESULT_SHARE_DESCRIPTION;

  return {
    basic: {
      title,
      description,
      url: resultUrl,
      type: "website",
      image: imageUrl,
      locale: "ru_RU",
      siteName: "Flowwow",
    },
  };
}
