export interface FeedConfig {
  source: string;
  url: string;
}

export const FEEDS: FeedConfig[] = [
  { source: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { source: "The Verge", url: "https://www.theverge.com/rss/index.xml" },
  { source: "Ars Technica", url: "https://arstechnica.com/gadgets/feed/" },
  { source: "Wired", url: "https://www.wired.com/feed/category/business/latest/rss" },
  { source: "Engadget", url: "https://www.engadget.com/rss.xml" },
  { source: "Hacker News", url: "https://hnrss.org/frontpage" }
];
