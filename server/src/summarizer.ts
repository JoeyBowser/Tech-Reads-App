import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5";
const MAX_ARTICLE_CHARS = 8000;
const SYSTEM_PROMPT =
  "You summarize tech news articles in 3-5 neutral, factual sentences of plain text. " +
  "No markdown, no preamble, no meta-commentary about the summary itself.";

let defaultClient: Anthropic | undefined;

function getDefaultClient(): Anthropic {
  defaultClient ??= new Anthropic();
  return defaultClient;
}

export async function summarizeArticle(
  title: string,
  articleText: string,
  client: Anthropic = getDefaultClient()
): Promise<string> {
  const truncated =
    articleText.length > MAX_ARTICLE_CHARS
      ? `${articleText.slice(0, MAX_ARTICLE_CHARS)}…`
      : articleText;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Title: ${title}\n\nArticle:\n${truncated}`
      }
    ]
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Summarizer returned no text content");
  }

  return textBlock.text.trim();
}
