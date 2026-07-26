import { Router } from "express";
import { getStories } from "../storyCache.js";
import { getCachedSummary, setCachedSummary } from "../summaryCache.js";
import { extractArticleText } from "../articleExtractor.js";
import { summarizeArticle } from "../summarizer.js";

export const summaryRouter = Router();

summaryRouter.get("/summary", async (req, res) => {
  const url = typeof req.query.url === "string" ? req.query.url : "";

  // Cached summaries stay servable even after the RSS pool refreshes and no
  // longer contains this URL (e.g. a saved story revisited days later) —
  // only a cache MISS needs the pool-membership check below, since that's
  // what actually guards against fetching arbitrary attacker-supplied URLs.
  const cached = getCachedSummary(url);
  if (cached) {
    res.json({ summary: cached });
    return;
  }

  const stories = await getStories();
  const story = stories.find((s) => s.url === url);

  if (!story) {
    res.status(404).json({ message: "Unknown story URL" });
    return;
  }

  try {
    const articleText = await extractArticleText(url);
    const summary = await summarizeArticle(story.title, articleText);
    setCachedSummary(url, summary);
    res.json({ summary });
  } catch {
    // Extraction or summarization failed (paywall, network issue, API error):
    // fall back to the short RSS description rather than breaking the detail view.
    res.json({ summary: story.summary });
  }
});
