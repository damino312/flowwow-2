import { buildOgSharePath } from "../const/shareOg";

export function buildOgShareUrl(name: string, birthDate: string): string {
  const params = new URLSearchParams({ name, date: birthDate });
  const relative = `${import.meta.env.BASE_URL}${buildOgSharePath(birthDate)}?${params}`;

  return new URL(relative, window.location.href).href;
}

export function resolveOgImageUrl(): string {
  const fromMeta = document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute("content")
    ?.trim();

  if (fromMeta) return fromMeta;

  return new URL(`${import.meta.env.BASE_URL}assets/`, window.location.href).href;
}
