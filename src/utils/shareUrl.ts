import {
  RESULT_PARAM_DATE,
  RESULT_PARAM_NAME,
} from "./resultParams";

export function buildResultShareUrl(name: string, birthDate: string): string {
  const params = new URLSearchParams({
    [RESULT_PARAM_NAME]: name,
    [RESULT_PARAM_DATE]: birthDate,
  });
  const relative = `${import.meta.env.BASE_URL}result?${params}`;

  return new URL(relative, window.location.href).href;
}

export async function sharePageLink(
  url: string,
  message: string,
): Promise<void> {
  const shareData: ShareData = { text: message, url };

  if (navigator.share) {
    if (!navigator.canShare || navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return;
    }

    if (navigator.canShare?.({ url })) {
      await navigator.share({ url });
      return;
    }
  }

  await navigator.clipboard.writeText(`${message}\n${url}`);
}

export function resolveOgImageUrl(): string {
  const fromMeta = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content")
    ?.trim();

  if (fromMeta) return fromMeta;

  return new URL(`${import.meta.env.BASE_URL}assets/`, window.location.href)
    .href;
}
