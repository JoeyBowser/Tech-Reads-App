import { useCallback, useEffect, useMemo, useState } from "react";
import type { Story } from "./types";
import { fetchStories } from "./api/stories";
import { StoryList } from "./components/StoryList";
import { StoryListSkeleton } from "./components/StoryListSkeleton";
import { StoryDetail } from "./components/StoryDetail";
import { StorySettings } from "./components/StorySettings";
import { SourceFilter } from "./components/SourceFilter";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  MAX_STORY_COUNT,
  getStoredStoryCount,
  setStoredStoryCount
} from "./lib/storyCountPreference";
import { getMutedSources, toggleMutedSource } from "./lib/sourceFilter";
import { getSavedStories } from "./lib/savedStories";
import { markAsRead } from "./lib/readStories";

type LoadState = "loading" | "error" | "ready";
type View = "today" | "saved";

export function App() {
  const [count, setCount] = useState<number>(() => getStoredStoryCount());
  const [storyPool, setStoryPool] = useState<Story[]>([]);
  const [mutedSources, setMutedSources] = useState<string[]>(() => getMutedSources());
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [view, setView] = useState<View>("today");
  const [savedVersion, setSavedVersion] = useState(0);

  const loadStories = useCallback(() => {
    let cancelled = false;

    setLoadState("loading");
    fetchStories(MAX_STORY_COUNT)
      .then((data) => {
        if (cancelled) return;
        setStoryPool(data);
        setLoadState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => loadStories(), [loadStories]);

  function handleCountChange(next: number) {
    setStoredStoryCount(next);
    setCount(next);
  }

  function handleSourceToggle(source: string) {
    toggleMutedSource(source);
    setMutedSources(getMutedSources());
  }

  function handleSelect(story: Story) {
    markAsRead(story.url);
    setSelectedStory(story);
  }

  function handleSaveToggle() {
    setSavedVersion((v) => v + 1);
  }

  const availableSources = useMemo(
    () => Array.from(new Set(storyPool.map((s) => s.source))),
    [storyPool]
  );
  const filteredPool = storyPool.filter((s) => !mutedSources.includes(s.source));
  const visibleStories = filteredPool.slice(0, count);
  const savedStories = useMemo(() => getSavedStories(), [savedVersion]);

  return (
    <main className="app">
      <div className="app__header">
        <h1 className="app__title">Tech Reads</h1>
        <ThemeToggle />
      </div>

      <div className="app__tabs">
        <button
          type="button"
          aria-pressed={view === "today"}
          className={`app__tab${view === "today" ? " app__tab--active" : ""}`}
          onClick={() => setView("today")}
        >
          Today
        </button>
        <button
          type="button"
          aria-pressed={view === "saved"}
          className={`app__tab${view === "saved" ? " app__tab--active" : ""}`}
          onClick={() => setView("saved")}
        >
          Saved ({savedStories.length})
        </button>
      </div>

      {view === "today" && !selectedStory && (
        <>
          <StorySettings count={count} onChange={handleCountChange} onRefresh={loadStories} />
          <SourceFilter
            sources={availableSources}
            muted={mutedSources}
            onToggle={handleSourceToggle}
          />
        </>
      )}

      {view === "today" && loadState === "loading" && (
        <>
          <p role="status">Loading today's stories…</p>
          <StoryListSkeleton />
        </>
      )}
      {view === "today" && loadState === "error" && (
        <p role="alert">Couldn't load stories. Please try again later.</p>
      )}

      {view === "today" && loadState === "ready" && !selectedStory && visibleStories.length === 0 && (
        <p className="app__empty">No stories match your selected sources.</p>
      )}

      {view === "today" && loadState === "ready" && !selectedStory && visibleStories.length > 0 && (
        <StoryList stories={visibleStories} onSelect={handleSelect} onSaveToggle={handleSaveToggle} />
      )}

      {view === "saved" && !selectedStory && savedStories.length === 0 && (
        <p className="app__empty">
          No saved stories yet — tap the bookmark icon on any story to save it here.
        </p>
      )}

      {view === "saved" && !selectedStory && savedStories.length > 0 && (
        <StoryList stories={savedStories} onSelect={handleSelect} onSaveToggle={handleSaveToggle} />
      )}

      {selectedStory && (
        <StoryDetail
          story={selectedStory}
          onBack={() => setSelectedStory(null)}
          onSaveToggle={handleSaveToggle}
        />
      )}
    </main>
  );
}
