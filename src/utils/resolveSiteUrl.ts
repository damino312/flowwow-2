/**
 * Абсолютный URL сайта для OG при сборке.
 * Задайте VITE_SITE_URL в .env.production или в CI (обязательно для продакшна).
 * Переменные Vercel — только запасной вариант для preview на vercel.app.
 */
export function resolveSiteUrl(env: Record<string, string>): string {
  const explicit = env.VITE_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const production = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return `https://${production.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  const vercel = env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  return "";
}
