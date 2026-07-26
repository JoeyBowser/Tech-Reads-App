interface SourceFilterProps {
  sources: string[];
  muted: string[];
  onToggle: (source: string) => void;
}

export function SourceFilter({ sources, muted, onToggle }: SourceFilterProps) {
  if (sources.length === 0) return null;

  return (
    <div className="source-filter" role="group" aria-label="Filter by source">
      {sources.map((source) => {
        const isMuted = muted.includes(source);
        return (
          <button
            key={source}
            type="button"
            className={`source-filter__chip${isMuted ? " source-filter__chip--muted" : ""}`}
            aria-pressed={!isMuted}
            onClick={() => onToggle(source)}
          >
            {source}
          </button>
        );
      })}
    </div>
  );
}
