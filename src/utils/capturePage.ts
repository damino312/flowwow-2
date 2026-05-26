const CAPTURE_SELECTOR = "#root";

function getCapturePaddingX() {
  return window.matchMedia("(max-width: 640px)").matches ? "1.2rem" : "3rem";
}

function shouldIncludeInCapture(node: HTMLElement) {
  return !node.closest(".result-actions");
}

export async function capturePageAsPng(): Promise<string> {
  const { toPng } = await import("html-to-image");
  const page = document.querySelector(CAPTURE_SELECTOR);

  if (!page) {
    throw new Error("Не удалось найти страницу для экспорта");
  }

  const element = page as HTMLElement;

  // filter скрывает кнопки только во внутреннем клоне — на экране ничего не меняется
  return toPng(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
    filter: (node) =>
      node instanceof HTMLElement ? shouldIncludeInCapture(node) : true,
    style: {
      boxSizing: "border-box",
      paddingLeft: getCapturePaddingX(),
      paddingRight: getCapturePaddingX(),
      // backgroundColor: "#ffffff",
    },
  });
}

export async function capturePageAsBlob(): Promise<Blob> {
  const dataUrl = await capturePageAsPng();
  const response = await fetch(dataUrl);
  return response.blob();
}

function blobToFile(blob: Blob, filename: string) {
  return new File([blob], filename, {
    type: blob.type || "application/octet-stream",
  });
}

function triggerAnchorDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Системное меню «Поделиться» (Telegram, AirDrop и т.д.) */
export async function shareImage(blob: Blob, filename: string) {
  const file = blobToFile(blob, filename);
  const shareData = { files: [file] };

  if (!navigator.share) {
    throw new Error("Sharing is not supported");
  }

  if (navigator.canShare && !navigator.canShare(shareData)) {
    throw new Error("Sharing files is not supported");
  }

  await navigator.share(shareData);
}

/** Скачивание картинки через <a download> */
export async function downloadImage(blob: Blob, filename: string) {
  const imageBlob =
    blob.type === "image/png"
      ? blob
      : new Blob([await blob.arrayBuffer()], { type: "image/png" });

  triggerAnchorDownload(imageBlob, filename);
}

/** Скачивание произвольного файла (например, txt fallback) */
export async function downloadFile(blob: Blob, filename: string) {
  triggerAnchorDownload(blob, filename);
}
