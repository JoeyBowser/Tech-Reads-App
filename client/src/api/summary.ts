export async function fetchSummary(url: string): Promise<string> {
  const res = await fetch(`/api/summary?url=${encodeURIComponent(url)}`);

  if (!res.ok) {
    throw new Error(`Failed to load summary (${res.status})`);
  }

  const data = (await res.json()) as { summary: string };
  return data.summary;
}
