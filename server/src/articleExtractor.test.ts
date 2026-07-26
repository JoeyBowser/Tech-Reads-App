import { describe, expect, it } from "vitest";
import { extractArticleText } from "./articleExtractor.js";

describe("extractArticleText", () => {
  it("strips HTML from the extracted content", async () => {
    const text = await extractArticleText("https://example.com/a", async () => ({
      content: "<p>Hello <strong>world</strong>.</p>"
    }));

    expect(text).toBe("Hello world.");
  });

  it("throws when no content is extracted", async () => {
    await expect(
      extractArticleText("https://example.com/b", async () => null)
    ).rejects.toThrow(/no article content/i);

    await expect(
      extractArticleText("https://example.com/c", async () => ({ content: null }))
    ).rejects.toThrow(/no article content/i);
  });
});
