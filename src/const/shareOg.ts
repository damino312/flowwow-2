import { monthPrediction } from "./copyrights";

export const SHARE_OG_TITLE =
  "Я узнала, когда мне закажут пионы на Flowwow!";

export const SHARE_OG_SITE_NAME = "Flowwow — Пионовый предсказатель";

export function getBirthMonth(birthDate: string): string {
  return birthDate.split(".")[1];
}

export function getPredictionDate(birthDate: string): string | undefined {
  return monthPrediction(getBirthMonth(birthDate))?.date;
}

export function buildShareOgDescription(birthDate: string): string {
  const predictionDate = getPredictionDate(birthDate);

  if (predictionDate) {
    return `Магический момент — ${predictionDate}. Узнай, когда тебе подарят пионы на Flowwow!`;
  }

  return "Узнай, когда тебе подарят пионы на Flowwow!";
}
