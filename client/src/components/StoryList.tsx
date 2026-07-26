import type { Story } from "../types";
import { StoryCard } from "./StoryCard";

interface StoryListProps {
  stories: Story[];
  onSelect: (story: Story) => void;
  onSaveToggle?: () => void;
}

export function StoryList({ stories, onSelect, onSaveToggle }: StoryListProps) {
  return (
    <ul className="story-list">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} onSelect={onSelect} onSaveToggle={onSaveToggle} />
      ))}
    </ul>
  );
}
