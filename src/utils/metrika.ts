type YmFunction = ((counterId: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[];
  l?: number;
};

declare global {
  interface Window {
    ym?: YmFunction;
  }
}

export const YM_GOALS = {
  predict: "predict",
  share: "share",
  download: "download",
  copyPromocode: "copy_promocode",
} as const;

const counterId = Number(import.meta.env.VITE_YM_COUNTER_ID);

let isInitialized = false;

function loadMetrikaScript(): void {
  const scriptUrl = "https://mc.yandex.ru/metrika/tag.js";

  for (let i = 0; i < document.scripts.length; i++) {
    if (document.scripts[i].src === scriptUrl) return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = scriptUrl;
  document.head.appendChild(script);
}

export function initMetrika(): void {
  if (isInitialized || !counterId || typeof window === "undefined") return;

  isInitialized = true;

  window.ym =
    window.ym ||
    function (...args: unknown[]) {
      (window.ym!.a = window.ym!.a || []).push(args);
    };

  window.ym.l = Date.now();
  loadMetrikaScript();

  window.ym(counterId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
  });
}

export function reachGoal(
  goal: (typeof YM_GOALS)[keyof typeof YM_GOALS],
): void {
  if (!counterId || !window.ym) return;
  window.ym(counterId, "reachGoal", goal);
}
