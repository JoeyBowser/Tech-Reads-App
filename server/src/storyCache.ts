import { fetchAllStories } from "./rssService.js";
import type { Story } from "./types.js";

const TTL_MS = 30 * 60 * 1000;

let cachedStories: Story[] = [];
let lastFetchedAt = 0;

export async function getStories(): Promise<Story[]> {
  const isStale = Date.now() - lastFetchedAt > TTL_MS;

  if (isStale) {
    try {
      const fresh = await fetchAllStories();
      if (fresh.length > 0) {
        cachedStories = fresh;
        lastFetchedAt = Date.now();
      }
    } catch {
      // Network hiccup fetching feeds: keep serving whatever is cached.
    }
  }

  return cachedStories;
}

export function resetCacheForTests(): void {
  cachedStories = [];
  lastFetchedAt = 0;
}
