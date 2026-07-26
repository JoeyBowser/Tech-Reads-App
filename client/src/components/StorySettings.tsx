import { STORY_COUNT_OPTIONS } from "../lib/storyCountPreference";

interface StorySettingsProps {
  count: number;
  onChange: (count: number) => void;
  onRefresh: () => void;
}

export function StorySettings({ count, onChange, onRefresh }: StorySettingsProps) {
  return (
    <div className="story-settings">
      <label htmlFor="story-count">Stories</label>
      <select
        id="story-count"
        value={count}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {STORY_COUNT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <button type="button" onClick={onRefresh}>
        Refresh
      </button>
    </div>
  );
}
