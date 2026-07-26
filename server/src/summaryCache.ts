const TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  summary: string;
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();

export function getCachedSummary(url: string): string | undefined {
  const entry = cache.get(url);
  if (!entry) return undefined;

  if (Date.now() - entry.cachedAt > TTL_MS) {
    cache.delete(url);
    return undefined;
  }

  return entry.summary;
}

export function setCachedSummary(url: string, summary: string): void {
  cache.set(url, { summary, cachedAt: Date.now() });
}

export function resetSummaryCacheForTests(): void {
  cache.clear();
}
