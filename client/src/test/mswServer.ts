import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { Story } from "../types";

export const mockStories: Story[] = Array.from({ length: 12 }, (_, i) => ({
  id: `story-${i}`,
  title: `Story ${i}`,
  summary: `Summary text for story ${i}.`,
  source: i === 0 ? "SourceB" : "SourceA",
  url: `https://example.com/story-${i}`,
  publishedAt: "2026-07-24T00:00:00.000Z"
}));

export const handlers = [
  http.get("/api/stories", ({ request }) => {
    const count = Number(new URL(request.url).searchParams.get("count")) || 5;
    return HttpResponse.json({ stories: mockStories.slice(0, count) });
  }),
  http.get("/api/summary", ({ request }) => {
    const url = new URL(request.url).searchParams.get("url") ?? "";
    const story = mockStories.find((s) => s.url === url);
    return HttpResponse.json({ summary: story?.summary ?? "" });
  })
];

export const server = setupServer(...handlers);
