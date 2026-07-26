import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Story } from "../types.js";
import { resetSummaryCacheForTests, setCachedSummary } from "../summaryCache.js";

const knownStory: Story = {
  id: "story-1",
  title: "Known Story",
  summary: "Short RSS summary.",
  source: "TestSource",
  url: "https://example.com/known",
  publishedAt: "2026-07-24T00:00:00.000Z"
};

vi.mock("../storyCache.js", () => ({
  getStories: vi.fn().mockResolvedValue([knownStory])
}));

const extractArticleText = vi.fn();
vi.mock("../articleExtractor.js", () => ({
  extractArticleText: (...args: unknown[]) => extractArticleText(...args)
}));

const summarizeArticle = vi.fn();
vi.mock("../summarizer.js", () => ({
  summarizeArticle: (...args: unknown[]) => summarizeArticle(...args)
}));

const { app } = await import("../app.js");

beforeEach(() => {
  resetSummaryCacheForTests();
  extractArticleText.mockReset();
  summarizeArticle.mockReset();
});

describe("GET /api/summary", () => {
  it("rejects urls that are not in the current story pool", async () => {
    const res = await request(app)
      .get("/api/summary")
      .query({ url: "https://example.com/unknown" });

    expect(res.status).toBe(404);
  });

  it("extracts and summarizes an article, then serves the cached result on the next call", async () => {
    extractArticleText.mockResolvedValue("Full article text.");
    summarizeArticle.mockResolvedValue("Generated long summary.");

    const res1 = await request(app).get("/api/summary").query({ url: knownStory.url });
    expect(res1.status).toBe(200);
    expect(res1.body.summary).toBe("Generated long summary.");
    expect(extractArticleText).toHaveBeenCalledTimes(1);
    expect(summarizeArticle).toHaveBeenCalledTimes(1);

    const res2 = await request(app).get("/api/summary").query({ url: knownStory.url });
    expect(res2.body.summary).toBe("Generated long summary.");
    expect(extractArticleText).toHaveBeenCalledTimes(1);
    expect(summarizeArticle).toHaveBeenCalledTimes(1);
  });

  it("falls back to the short RSS summary when extraction fails", async () => {
    extractArticleText.mockRejectedValue(new Error("network error"));

    const res = await request(app).get("/api/summary").query({ url: knownStory.url });

    expect(res.status).toBe(200);
    expect(res.body.summary).toBe(knownStory.summary);
  });

  it("falls back to the short RSS summary when summarization fails", async () => {
    extractArticleText.mockResolvedValue("Full article text.");
    summarizeArticle.mockRejectedValue(new Error("api error"));

    const res = await request(app).get("/api/summary").query({ url: knownStory.url });

    expect(res.status).toBe(200);
    expect(res.body.summary).toBe(knownStory.summary);
  });

  it("serves a cached summary even for a url no longer in the story pool", async () => {
    const staleUrl = "https://example.com/no-longer-in-pool";
    setCachedSummary(staleUrl, "Old cached summary.");

    const res = await request(app).get("/api/summary").query({ url: staleUrl });

    expect(res.status).toBe(200);
    expect(res.body.summary).toBe("Old cached summary.");
    expect(extractArticleText).not.toHaveBeenCalled();
  });
});
