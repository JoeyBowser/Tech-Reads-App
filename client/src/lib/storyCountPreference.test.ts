import { describe, expect, it } from "vitest";
import {
  DEFAULT_STORY_COUNT,
  getStoredStoryCount,
  setStoredStoryCount
} from "./storyCountPreference";

describe("storyCountPreference", () => {
  it("defaults to 5 when nothing is stored", () => {
    expect(getStoredStoryCount()).toBe(DEFAULT_STORY_COUNT);
  });

  it("round-trips a valid stored value", () => {
    setStoredStoryCount(10);
    expect(getStoredStoryCount()).toBe(10);
  });

  it("falls back to the default for a value outside the allowed options", () => {
    window.localStorage.setItem("techReads.storyCount", "999");
    expect(getStoredStoryCount()).toBe(DEFAULT_STORY_COUNT);
  });

  it("falls back to the default for garbage input", () => {
    window.localStorage.setItem("techReads.storyCount", "not-a-number");
    expect(getStoredStoryCount()).toBe(DEFAULT_STORY_COUNT);
  });
});
