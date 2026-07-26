import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import type { Story } from "../types.js";

const mockStories: Story[] = Array.from({ length: 8 }, (_, i) => ({
  id: `story-${i}`,
  title: `Story ${i}`,
  summary: `Summary ${i}`,
  source: "TestSource",
  url: `https://example.com/${i}`,
  publishedAt: "2026-07-24T00:00:00.000Z"
}));

vi.mock("../storyCache.js", () => ({
  getStories: vi.fn().mockResolvedValue(mockStories)
}));

const { app } = await import("../app.js");

describe("GET /api/stories", () => {
  it("defaults to 5 stories", async () => {
    const res = await request(app).get("/api/stories");

    expect(res.status).toBe(200);
    expect(res.body.stories).toHaveLength(5);
  });

  it("respects a valid count query param", async () => {
    const res = await request(app).get("/api/stories?count=3");

    expect(res.body.stories).toHaveLength(3);
  });

  it("clamps count to the available pool size and the max of 15", async () => {
    const res = await request(app).get("/api/stories?count=100");

    expect(res.body.stories.length).toBeLessThanOrEqual(8);
  });

  it("only returns stories from the cached pool", async () => {
    const res = await request(app).get("/api/stories?count=8");
    const urls = res.body.stories.map((s: Story) => s.url);

    for (const url of urls) {
      expect(mockStories.some((s) => s.url === url)).toBe(true);
    }
  });
});
