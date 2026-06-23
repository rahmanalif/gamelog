const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const API_ORIGIN = (() => {
  try {
    const u = new URL(API_BASE_URL);
    return u.origin;
  } catch {
    return "";
  }
})();

export function fixImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\/localhost[:/]/i.test(url) && API_ORIGIN && !API_ORIGIN.includes("localhost")) {
    return url.replace(/^https?:\/\/localhost(:\d+)?/, API_ORIGIN);
  }
  return url;
}
