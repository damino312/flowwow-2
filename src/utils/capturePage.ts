import { toJpeg } from "html-to-image";

const CAPTURE_SELECTOR = "div.layout";

function getCapturePaddingX() {
  return window.matchMedia("(max-width: 640px)").matches ? "1.2rem" : "3rem";
}

function resolveCaptureElement(): HTMLElement {
  const root = document.querySelector(CAPTURE_SELECTOR);

  if (root instanceof HTMLElement) return root;

  throw new Error("Не удалось найти страницу для экспорта");
}

function shouldIncludeInCapture(node: HTMLElement) {
  return !node.closest(".result-actions");
}

export async function capturePageAsPng(): Promise<string> {
  const element = resolveCaptureElement();

  return toJpeg(element, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: "#ffffff",
    filter: (node) =>
      node instanceof HTMLElement ? shouldIncludeInCapture(node) : true,
    style: {
      boxSizing: "border-box",
      paddingLeft: getCapturePaddingX(),
      paddingRight: getCapturePaddingX(),
      backgroundColor: "#ffffff",
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

function shouldUseClipboardShare(): boolean {
  const isMobileUa = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobileUa) return false;

  return window.matchMedia("(pointer: fine)").matches;
}

async function blobToPng(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Не удалось подготовить изображение");
  }

  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const pngBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!pngBlob) {
    throw new Error("Не удалось подготовить изображение");
  }

  return pngBlob;
}

async function copyImageToClipboard(blob: Blob): Promise<void> {
  if (!navigator.clipboard?.write) {
    throw new Error("Clipboard is not supported");
  }

  const pngBlob = await blobToPng(blob);

  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": Promise.resolve(pngBlob),
    }),
  ]);
}

/** Системное меню «Поделиться»: скрин + текст */
export async function shareImageWithText(
  blob: Blob,
  filename: string,
  message: string,
): Promise<void> {
  if (shouldUseClipboardShare()) {
    await copyImageToClipboard(blob);
    window.alert(
      "Картинка скопирована.\n\n1. Вставьте её в чат (⌘V или Ctrl+V).\n2. Нажмите OK — скопируем текст для подписи.",
    );
    await navigator.clipboard.writeText(message);
    return;
  }

  if (!navigator.share) {
    throw new Error("Sharing is not supported");
  }

  const file = blobToFile(blob, filename);
  const filesOnly: ShareData = { files: [file] };

  if (!navigator.canShare?.(filesOnly)) {
    throw new Error("Sharing files is not supported");
  }

  await navigator.share(filesOnly);

  try {
    await navigator.clipboard.writeText(message);
  } catch {
    /* подпись необязательна */
  }
}

/** Скачивание картинки через <a download> */
export async function downloadImage(blob: Blob, filename: string) {
  const imageBlob =
    blob.type === "image/jpeg"
      ? blob
      : new Blob([await blob.arrayBuffer()], { type: "image/jpeg" });

  triggerAnchorDownload(imageBlob, filename);
}

/** Скачивание произвольного файла (например, txt fallback) */
export async function downloadFile(blob: Blob, filename: string) {
  triggerAnchorDownload(blob, filename);
}
