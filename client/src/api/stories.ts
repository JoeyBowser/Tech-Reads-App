import type { Story } from "../types";

export async function fetchStories(count = 5): Promise<Story[]> {
  const res = await fetch(`/api/stories?count=${count}`);

  if (!res.ok) {
    throw new Error(`Failed to load stories (${res.status})`);
  }

  const data = (await res.json()) as { stories: Story[] };
  return data.stories;
}
