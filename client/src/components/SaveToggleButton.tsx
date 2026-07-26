import { useState } from "react";
import type { Story } from "../types";
import { isSaved, toggleSaved } from "../lib/savedStories";

interface SaveToggleButtonProps {
  story: Story;
  className?: string;
  onToggle?: () => void;
}

export function SaveToggleButton({ story, className, onToggle }: SaveToggleButtonProps) {
  const [saved, setSaved] = useState(() => isSaved(story.url));

  function handleClick() {
    toggleSaved(story);
    setSaved((prev) => !prev);
    onToggle?.();
  }

  return (
    <button
      type="button"
      className={className ? `${className} save-toggle` : "save-toggle"}
      aria-pressed={saved}
      onClick={handleClick}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
