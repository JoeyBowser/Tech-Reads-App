const STORAGE_KEY = "techReads.readUrls";

function readUrls(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function isRead(url: string): boolean {
  return readUrls().includes(url);
}

export function markAsRead(url: string): void {
  const urls = readUrls();
  if (urls.includes(url)) return;

  urls.push(url);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}
