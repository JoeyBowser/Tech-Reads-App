import { useEffect, useState } from "react";
import type { Story } from "../types";
import { fetchSummary } from "../api/summary";
import { SaveToggleButton } from "./SaveToggleButton";

interface StoryDetailProps {
  story: Story;
  onBack: () => void;
  onSaveToggle?: () => void;
}

export function StoryDetail({ story, onBack, onSaveToggle }: StoryDetailProps) {
  const [summary, setSummary] = useState(story.summary);
  const [isLoadingFullSummary, setIsLoadingFullSummary] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setSummary(story.summary);
    setIsLoadingFullSummary(true);

    fetchSummary(story.url)
      .then((longSummary) => {
        if (cancelled) return;
        setSummary(longSummary);
      })
      .catch(() => {
        // Keep showing the short RSS summary already in state.
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoadingFullSummary(false);
      });

    return () => {
      cancelled = true;
    };
  }, [story.url, story.summary]);

  return (
    <article className="story-detail">
      <button type="button" onClick={onBack} className="story-detail__back">
        ← Back
      </button>
      <span className="story-detail__source">{story.source}</span>
      <h2 className="story-detail__title">{story.title}</h2>
      <p className="story-detail__summary">{summary}</p>
      {isLoadingFullSummary && (
        <p className="story-detail__loading">Getting the full summary…</p>
      )}
      <div className="story-detail__actions">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="story-detail__link"
        >
          Read full article ↗
        </a>
        <SaveToggleButton story={story} onToggle={onSaveToggle} />
      </div>
    </article>
  );
}
