import { validateDate } from "./validators";

/** Encoded payload: /result?r=... */
export const RESULT_PARAM = "r";

/** Legacy plain params — kept for old shared links. */
export const RESULT_PARAM_NAME = "name";
export const RESULT_PARAM_DATE = "date";

type ResultPayload = {
  name: string;
  date: string;
};

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(value: string): string | null {
  try {
    let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function encodeResultPayload(name: string, date: string): string {
  return encodeBase64Url(JSON.stringify({ name, date } satisfies ResultPayload));
}

function decodeResultPayload(encoded: string): ResultPayload | null {
  const json = decodeBase64Url(encoded);
  if (!json) return null;

  try {
    const parsed = JSON.parse(json) as Partial<ResultPayload>;
    if (typeof parsed.name !== "string" || typeof parsed.date !== "string") {
      return null;
    }

    return { name: parsed.name.trim(), date: parsed.date.trim() };
  } catch {
    return null;
  }
}

function parseResultPayload(
  name: string,
  date: string,
): { name: string; date: string } | null {
  if (!name || !date) return null;

  const validation = validateDate(date);
  if (!validation.isValid) return null;

  return { name, date };
}

export function hasResultParams(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has(RESULT_PARAM) ||
    searchParams.has(RESULT_PARAM_NAME) ||
    searchParams.has(RESULT_PARAM_DATE)
  );
}

export function buildResultSearchParams(
  name: string,
  date: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set(RESULT_PARAM, encodeResultPayload(name, date));
  return params;
}

export function buildResultPath(name: string, date: string): string {
  return `/result?${buildResultSearchParams(name, date).toString()}`;
}

export function buildResultShareUrl(name: string, date: string): string {
  return `${window.location.origin}${buildResultPath(name, date)}`;
}

export function readResultParams(
  searchParams: URLSearchParams,
): { name: string; date: string } | null {
  const encoded = searchParams.get(RESULT_PARAM);
  if (encoded) {
    const decoded = decodeResultPayload(encoded);
    if (decoded) return parseResultPayload(decoded.name, decoded.date);
  }

  const name = searchParams.get(RESULT_PARAM_NAME)?.trim() ?? "";
  const date = searchParams.get(RESULT_PARAM_DATE)?.trim() ?? "";
  return parseResultPayload(name, date);
}
