import { describe, expect, it, vi } from "vitest";
import type Anthropic from "@anthropic-ai/sdk";
import { summarizeArticle } from "./summarizer.js";

function fakeClient(text: string) {
  const create = vi.fn().mockResolvedValue({
    content: [{ type: "text", text }]
  });
  return { client: { messages: { create } } as unknown as Anthropic, create };
}

describe("summarizeArticle", () => {
  it("returns the trimmed text from the response", async () => {
    const { client } = fakeClient("  A concise summary.  ");

    const summary = await summarizeArticle("Some Title", "Article body text.", client);

    expect(summary).toBe("A concise summary.");
  });

  it("sends the title and article text in the user message", async () => {
    const { client, create } = fakeClient("Summary.");

    await summarizeArticle("My Title", "Body content here.", client);

    const call = create.mock.calls[0][0];
    expect(call.model).toBe("claude-haiku-4-5");
    expect(call.messages[0].content).toContain("My Title");
    expect(call.messages[0].content).toContain("Body content here.");
  });

  it("truncates very long article text before sending it", async () => {
    const { client, create } = fakeClient("Summary.");
    const longText = "word ".repeat(5000);

    await summarizeArticle("Title", longText, client);

    const call = create.mock.calls[0][0];
    expect(call.messages[0].content.length).toBeLessThan(longText.length);
  });

  it("throws when the response has no text block", async () => {
    const client = {
      messages: { create: vi.fn().mockResolvedValue({ content: [] }) }
    } as unknown as Anthropic;

    await expect(summarizeArticle("Title", "Body", client)).rejects.toThrow(
      /no text content/i
    );
  });
});
