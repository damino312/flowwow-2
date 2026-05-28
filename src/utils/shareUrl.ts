import { buildOgSharePath } from "../const/shareOg";

export function buildOgShareUrl(name: string, birthDate: string): string {
  const params = new URLSearchParams({ name, date: birthDate });
  const relative = `${import.meta.env.BASE_URL}${buildOgSharePath(birthDate)}?${params}`;

  return new URL(relative, window.location.href).href;
}

export async function shareOpenGraphLink(
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
