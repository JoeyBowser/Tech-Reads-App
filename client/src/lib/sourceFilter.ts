const STORAGE_KEY = "techReads.mutedSources";

function readMuted(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function getMutedSources(): string[] {
  return readMuted();
}

export function isSourceMuted(source: string): boolean {
  return readMuted().includes(source);
}

export function toggleMutedSource(source: string): void {
  const muted = readMuted();
  const next = muted.includes(source)
    ? muted.filter((s) => s !== source)
    : [...muted, source];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
