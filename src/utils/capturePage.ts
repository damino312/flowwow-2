const CAPTURE_SELECTOR = "#root";
const CAPTURE_CLASS = "is-capturing";

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

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

function collectBackgroundImageUrls(root: HTMLElement) {
  const urls = new Set<string>();

  [root, ...root.querySelectorAll<HTMLElement>("*")].forEach((el) => {
    const { backgroundImage } = window.getComputedStyle(el);
    if (!backgroundImage || backgroundImage === "none") return;

    for (const part of backgroundImage.split(",")) {
      const match = part.trim().match(/^url\(["']?(.+?)["']?\)$/);
      if (match?.[1] && !match[1].startsWith("data:")) {
        urls.add(match[1]);
      }
    }
  });

  return [...urls];
}

function loadUrl(url: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

async function waitForElementImages(root: HTMLElement) {
  await Promise.all(
    [...root.querySelectorAll("img")].map(async (img) => {
      if (!img.complete || img.naturalWidth === 0) {
        await new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        });
      }

      try {
        await img.decode();
      } catch {
        // ignore decode errors
      }
    }),
  );
}

/** Ждём шрифты, <img> и CSS-фоны — иначе первый снимок может быть без картинок */
export async function preloadCaptureAssets() {
  const root = document.querySelector(CAPTURE_SELECTOR);
  if (!(root instanceof HTMLElement)) return;

  if ("fonts" in document) {
    await document.fonts.ready;
  }

  await Promise.all([
    waitForElementImages(root),
    ...collectBackgroundImageUrls(root).map(loadUrl),
  ]);
}

export async function capturePageAsPng(): Promise<string> {
  const { toPng } = await import("html-to-image");
  const element = resolveCaptureElement();

  document.documentElement.classList.add(CAPTURE_CLASS);
  await preloadCaptureAssets();
  await waitForPaint();

  try {
    return await toPng(element, {
      pixelRatio: 2,
      cacheBust: false,
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
  } finally {
    document.documentElement.classList.remove(CAPTURE_CLASS);
  }
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
