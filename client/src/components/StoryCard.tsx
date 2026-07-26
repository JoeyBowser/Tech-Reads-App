import type { Story } from "../types";
import { formatRelativeTime } from "../lib/relativeTime";
import { isRead } from "../lib/readStories";
import { SaveToggleButton } from "./SaveToggleButton";

interface StoryCardProps {
  story: Story;
  onSelect: (story: Story) => void;
  onSaveToggle?: () => void;
}

export function StoryCard({ story, onSelect, onSaveToggle }: StoryCardProps) {
  const read = isRead(story.url);

  return (
    <li className={`story-card${read ? " story-card--read" : ""}`}>
      <button type="button" className="story-card__button" onClick={() => onSelect(story)}>
        {story.imageUrl && (
          <img
            className="story-card__thumb"
            src={story.imageUrl}
            alt=""
            loading="lazy"
          />
        )}
        <span className="story-card__meta">
          <span className="story-card__source">{story.source}</span>
          <span className="story-card__time">{formatRelativeTime(story.publishedAt)}</span>
        </span>
        <h2 className="story-card__title">{story.title}</h2>
      </button>
      <SaveToggleButton story={story} className="story-card__save" onToggle={onSaveToggle} />
    </li>
  );
}
