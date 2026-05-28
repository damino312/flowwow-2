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
