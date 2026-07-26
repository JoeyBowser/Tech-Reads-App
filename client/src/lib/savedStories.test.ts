import { describe, expect, it } from "vitest";
import { getSavedStories, isSaved, toggleSaved } from "./savedStories";
import type { Story } from "../types";

const story: Story = {
  id: "s1",
  title: "A Story",
  summary: "Summary.",
  source: "TestSource",
  url: "https://example.com/a",
  publishedAt: "2026-07-24T00:00:00.000Z"
};

describe("savedStories", () => {
  it("has no saved stories by default", () => {
    expect(getSavedStories()).toEqual([]);
    expect(isSaved(story.url)).toBe(false);
  });

  it("saves the full story object on toggle", () => {
    toggleSaved(story);

    expect(isSaved(story.url)).toBe(true);
    expect(getSavedStories()).toEqual([story]);
  });

  it("unsaves on a second toggle", () => {
    toggleSaved(story);
    toggleSaved(story);

    expect(isSaved(story.url)).toBe(false);
    expect(getSavedStories()).toEqual([]);
  });

  it("keeps a saved story intact even if it is not the current pool", () => {
    toggleSaved(story);

    const [saved] = getSavedStories();
    expect(saved.title).toBe(story.title);
    expect(saved.summary).toBe(story.summary);
  });
});
