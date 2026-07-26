const PLACEHOLDER_COUNT = 5;

export function StoryListSkeleton() {
  return (
    <ul className="story-list" aria-hidden="true">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
        <li key={i} className="story-card story-card--skeleton">
          <div className="story-card__skeleton-thumb" />
          <div className="story-card__skeleton-line story-card__skeleton-line--short" />
          <div className="story-card__skeleton-line" />
        </li>
      ))}
    </ul>
  );
}
