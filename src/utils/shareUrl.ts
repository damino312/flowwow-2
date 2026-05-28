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
  const textWithUrl = `${message}\n\n${url}`;

  if (!navigator.share) {
    await navigator.clipboard.writeText(textWithUrl);
    return;
  }

  // Telegram, WhatsApp и др. берут только text; url отдельным полем часто теряется
  try {
    await navigator.share({ text: textWithUrl });
    return;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
  }

  try {
    await navigator.share({ url, title: message });
    return;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
  }

  await navigator.clipboard.writeText(textWithUrl);
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
