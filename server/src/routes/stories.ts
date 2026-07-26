import { Router } from "express";
import { getStories } from "../storyCache.js";
import { shuffle, clampCount } from "../shuffle.js";

export const storiesRouter = Router();

storiesRouter.get("/stories", async (req, res) => {
  const count = clampCount(req.query.count);
  const allStories = await getStories();
  const stories = shuffle(allStories).slice(0, count);

  res.json({ stories });
});
