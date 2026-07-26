import express from "express";
import cors from "cors";
import { storiesRouter } from "./routes/stories.js";
import { summaryRouter } from "./routes/summary.js";

export const app = express();

app.use(cors());
app.use("/api", storiesRouter);
app.use("/api", summaryRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
