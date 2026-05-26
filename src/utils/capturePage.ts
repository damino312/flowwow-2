const CAPTURE_SELECTOR = "#root";
const HIDE_DURING_CAPTURE = [".result-actions"];

function hideElements(selectors: string[]) {
  const elements = selectors.flatMap((selector) =>
    Array.from(document.querySelectorAll<HTMLElement>(selector)),
  );

  return elements.map((el) => {
    const visibility = el.style.visibility;
    el.style.visibility = "hidden";
    return { el, visibility };
  });
}

function restoreElements(hidden: { el: HTMLElement; visibility: string }[]) {
  hidden.forEach(({ el, visibility }) => {
    el.style.visibility = visibility;
  });
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function resetMotionTransforms() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("main"));
  return elements.map((el) => {
    const transform = el.style.transform;
    el.style.transform = "none";
    return { el, transform };
  });
}

function restoreMotionTransforms(
  items: { el: HTMLElement; transform: string }[],
) {
  items.forEach(({ el, transform }) => {
    el.style.transform = transform;
  });
}

function getCapturePaddingX() {
  return window.matchMedia("(max-width: 640px)").matches ? "1.2rem" : "3rem";
}

function applyCapturePadding(element: HTMLElement) {
  const saved = {
    paddingLeft: element.style.paddingLeft,
    paddingRight: element.style.paddingRight,
    boxSizing: element.style.boxSizing,
    backgroundColor: element.style.backgroundColor,
  };

  element.style.boxSizing = "border-box";
  element.style.paddingLeft = getCapturePaddingX();
  element.style.paddingRight = getCapturePaddingX();
  element.style.backgroundColor = "#ffffff";

  return saved;
}

function restoreCapturePadding(
  element: HTMLElement,
  saved: ReturnType<typeof applyCapturePadding>,
) {
  element.style.paddingLeft = saved.paddingLeft;
  element.style.paddingRight = saved.paddingRight;
  element.style.boxSizing = saved.boxSizing;
  element.style.backgroundColor = saved.backgroundColor;
}

export async function capturePageAsPng(): Promise<string> {
  const { toPng } = await import("html-to-image");
  const page = document.querySelector(CAPTURE_SELECTOR);

  if (!page) {
    throw new Error("Не удалось найти страницу для экспорта");
  }

  const element = page as HTMLElement;
  const hidden = hideElements(HIDE_DURING_CAPTURE);
  const motionReset = resetMotionTransforms();
  const padding = applyCapturePadding(element);
  await waitForPaint();

  try {
    return await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: "#ffffff",
    });
  } finally {
    restoreCapturePadding(element, padding);
    restoreElements(hidden);
    restoreMotionTransforms(motionReset);
  }
}

export async function capturePageAsBlob(): Promise<Blob> {
  const dataUrl = await capturePageAsPng();
  const response = await fetch(dataUrl);
  return response.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}
