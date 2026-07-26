import Parser from "rss-parser";
import { FEEDS, type FeedConfig } from "./feeds.js";
import type { Story } from "./types.js";

const parser = new Parser();

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function truncate(text: string, maxLength = 600): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function normalizeItem(item: Parser.Item, source: string): Story | null {
  if (!item.link || !item.title) return null;

  const rawSummary =
    item.contentSnippet ??
    (item.content ? stripHtml(item.content) : "") ??
    (item.summary ? stripHtml(item.summary) : "");

  return {
    id: item.guid ? `${source}:${item.guid}` : item.link,
    title: stripHtml(item.title),
    summary: truncate(stripHtml(rawSummary) || "No summary available."),
    source,
    url: item.link,
    publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
    imageUrl: item.enclosure?.url
  };
}

export type FeedFetcher = (url: string) => Promise<{ items: Parser.Item[] }>;

const defaultFetchFeed: FeedFetcher = (url) => parser.parseURL(url);

export async function fetchAllStories(
  feeds: FeedConfig[] = FEEDS,
  fetchFeed: FeedFetcher = defaultFetchFeed
): Promise<Story[]> {
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const parsed = await fetchFeed(feed.url);
      return parsed.items
        .map((item) => normalizeItem(item, feed.source))
        .filter((story): story is Story => story !== null);
    })
  );

  const seen = new Set<string>();
  const stories: Story[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const story of result.value) {
      if (seen.has(story.url)) continue;
      seen.add(story.url);
      stories.push(story);
    }
  }

  return stories;
}
