import { validateDate } from "./validators";

export const RESULT_PARAM_NAME = "name";
export const RESULT_PARAM_DATE = "date";

export function buildResultPath(name: string, date: string): string {
  const params = new URLSearchParams();
  params.set(RESULT_PARAM_NAME, name);
  params.set(RESULT_PARAM_DATE, date);
  return `/result?${params.toString()}`;
}

export function readResultParams(
  searchParams: URLSearchParams,
): { name: string; date: string } | null {
  const name = searchParams.get(RESULT_PARAM_NAME)?.trim();
  const date = searchParams.get(RESULT_PARAM_DATE)?.trim();

  if (!name || !date) return null;

  const validation = validateDate(date);
  if (!validation.isValid) return null;

  return { name, date };
}
