const STORAGE_KEY = "techReads.storyCount";

export const STORY_COUNT_OPTIONS = [5, 7, 10, 12] as const;
export const DEFAULT_STORY_COUNT = 5;
export const MAX_STORY_COUNT = Math.max(...STORY_COUNT_OPTIONS);

export function getStoredStoryCount(): number {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw);

  return STORY_COUNT_OPTIONS.includes(parsed as (typeof STORY_COUNT_OPTIONS)[number])
    ? parsed
    : DEFAULT_STORY_COUNT;
}

export function setStoredStoryCount(count: number): void {
  window.localStorage.setItem(STORAGE_KEY, String(count));
}
