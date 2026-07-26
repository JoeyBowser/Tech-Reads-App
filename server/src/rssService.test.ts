import { describe, expect, it } from "vitest";
import { fetchAllStories, normalizeItem } from "./rssService.js";
import type { FeedConfig } from "./feeds.js";

describe("normalizeItem", () => {
  it("normalizes a well-formed RSS item", () => {
    const story = normalizeItem(
      {
        title: "AI <b>Breakthrough</b>",
        link: "https://example.com/a",
        contentSnippet: "Researchers announce a new model.",
        isoDate: "2026-07-24T10:00:00.000Z",
        guid: "guid-1"
      },
      "TechCrunch"
    );

    expect(story).toEqual({
      id: "TechCrunch:guid-1",
      title: "AI Breakthrough",
      summary: "Researchers announce a new model.",
      source: "TechCrunch",
      url: "https://example.com/a",
      publishedAt: "2026-07-24T10:00:00.000Z",
      imageUrl: undefined
    });
  });

  it("falls back to stripped HTML content when contentSnippet is missing", () => {
    const story = normalizeItem(
      {
        title: "Launch Day",
        link: "https://example.com/b",
        content: "<p>Big <strong>launch</strong> today.</p>"
      },
      "The Verge"
    );

    expect(story?.summary).toBe("Big launch today.");
  });

  it("truncates long summaries", () => {
    const longText = "word ".repeat(200);
    const story = normalizeItem(
      { title: "Long Story", link: "https://example.com/c", contentSnippet: longText },
      "Wired"
    );

    expect(story?.summary.length).toBeLessThanOrEqual(600);
    expect(story?.summary.endsWith("…")).toBe(true);
  });

  it("returns null when required fields are missing", () => {
    expect(normalizeItem({ title: "No link" }, "Engadget")).toBeNull();
    expect(normalizeItem({ link: "https://example.com/d" }, "Engadget")).toBeNull();
  });
});

describe("fetchAllStories", () => {
  const feeds: FeedConfig[] = [
    { source: "FeedA", url: "https://feeda.test/rss" },
    { source: "FeedB", url: "https://feedb.test/rss" }
  ];

  it("aggregates and dedupes stories across feeds", async () => {
    const fetchFeed = async (url: string) => {
      if (url === "https://feeda.test/rss") {
        return {
          items: [
            { title: "Story 1", link: "https://example.com/1", contentSnippet: "Summary 1" },
            { title: "Shared Story", link: "https://example.com/shared", contentSnippet: "Shared" }
          ]
        };
      }
      return {
        items: [
          { title: "Shared Story", link: "https://example.com/shared", contentSnippet: "Shared" },
          { title: "Story 2", link: "https://example.com/2", contentSnippet: "Summary 2" }
        ]
      };
    };

    const stories = await fetchAllStories(feeds, fetchFeed);

    expect(stories).toHaveLength(3);
    expect(stories.map((s) => s.url).sort()).toEqual([
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/shared"
    ]);
  });

  it("skips feeds that fail to fetch without throwing", async () => {
    const fetchFeed = async (url: string) => {
      if (url === "https://feeda.test/rss") {
        throw new Error("network error");
      }
      return { items: [{ title: "OK", link: "https://example.com/ok", contentSnippet: "fine" }] };
    };

    const stories = await fetchAllStories(feeds, fetchFeed);

    expect(stories).toHaveLength(1);
    expect(stories[0]?.url).toBe("https://example.com/ok");
  });
});
