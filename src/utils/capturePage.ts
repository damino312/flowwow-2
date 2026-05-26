const CAPTURE_ROOT_SELECTOR = "main.result-layout";
const FALLBACK_SELECTOR = "#root";

const EXPAND_LAYOUT_SELECTORS = [
  "main",
  ".container",
  ".result",
  ".result-body",
].join(", ");

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
  const resultMain = document.querySelector(CAPTURE_ROOT_SELECTOR);
  if (resultMain instanceof HTMLElement) return resultMain;

  const root = document.querySelector(FALLBACK_SELECTOR);
  if (root instanceof HTMLElement) return root;

  throw new Error("Не удалось найти страницу для экспорта");
}

function expandCloneForFullContent(root: HTMLElement) {
  const nodes = [
    root,
    ...root.querySelectorAll<HTMLElement>(EXPAND_LAYOUT_SELECTORS),
  ];

  nodes.forEach((el) => {
    Object.assign(el.style, {
      overflow: "visible",
      minHeight: "auto",
      height: "auto",
      maxHeight: "none",
    });

    if (el.classList.contains("result") || el.classList.contains("result-body")) {
      el.style.flex = "none";
    }
  });
}

function removeActionsFromClone(root: HTMLElement) {
  root.querySelectorAll(".result-actions").forEach((node) => node.remove());
}

function createCaptureClone(source: HTMLElement) {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");

  removeActionsFromClone(clone);
  expandCloneForFullContent(clone);

  const width = source.getBoundingClientRect().width;

  Object.assign(clone.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    opacity: "0",
    pointerEvents: "none",
    zIndex: "-1",
    width: `${width}px`,
    overflow: "visible",
    boxSizing: "border-box",
    paddingLeft: getCapturePaddingX(),
    paddingRight: getCapturePaddingX(),
  });

  document.body.appendChild(clone);
  return clone;
}

function measureClone(clone: HTMLElement) {
  return {
    width: Math.ceil(clone.scrollWidth),
    height: Math.ceil(clone.scrollHeight),
  };
}

export async function capturePageAsPng(): Promise<string> {
  const { toPng } = await import("html-to-image");
  const source = resolveCaptureElement();
  const clone = createCaptureClone(source);
  await waitForPaint();

  const { width, height } = measureClone(clone);

  try {
    return await toPng(clone, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
        overflow: "visible",
        boxSizing: "border-box",
      },
    });
  } finally {
    clone.remove();
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
