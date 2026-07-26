import type { Story } from "../types";

const STORAGE_KEY = "techReads.savedStories";

function readSaved(): Story[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Story[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(stories: Story[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

export function getSavedStories(): Story[] {
  return readSaved();
}

export function isSaved(url: string): boolean {
  return readSaved().some((story) => story.url === url);
}

export function toggleSaved(story: Story): void {
  const saved = readSaved();
  const next = saved.some((s) => s.url === story.url)
    ? saved.filter((s) => s.url !== story.url)
    : [...saved, story];

  writeSaved(next);
}
