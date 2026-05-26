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

function isIOS() {
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function showIOSImageSaveOverlay(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Сохранение изображения");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9999",
    background: "rgba(0, 0, 0, 0.92)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "16px",
    boxSizing: "border-box",
  });

  const hint = document.createElement("p");
  hint.textContent = "Удерживайте изображение → «Сохранить в Фото»";
  Object.assign(hint.style, {
    margin: "0",
    color: "#fff",
    fontSize: "16px",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
  });

  const img = document.createElement("img");
  img.src = url;
  img.alt = "Результат предсказания";
  Object.assign(img.style, {
    maxWidth: "100%",
    maxHeight: "75vh",
    borderRadius: "12px",
    userSelect: "auto",
    WebkitUserSelect: "auto",
  });

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Закрыть";
  Object.assign(close.style, {
    border: "0",
    borderRadius: "999px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#fff",
    color: "#370b27",
  });

  const cleanup = () => {
    overlay.remove();
    URL.revokeObjectURL(url);
  };

  close.addEventListener("click", cleanup);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) cleanup();
  });

  overlay.append(hint, img, close);
  document.body.appendChild(overlay);
}

export async function downloadBlob(blob: Blob, filename: string) {
  const file = new File([blob], filename, {
    type: blob.type || "application/octet-stream",
  });
  const shareData = { files: [file] };

  if (isIOS()) {
    if (navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    if (blob.type.startsWith("image/")) {
      showIOSImageSaveOverlay(blob);
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title: filename,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
  }

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
