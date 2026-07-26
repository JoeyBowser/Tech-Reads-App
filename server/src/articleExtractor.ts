import { extract } from "@extractus/article-extractor";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export type ExtractedArticle = { content?: string | null } | null;
export type ArticleExtractFn = (url: string) => Promise<ExtractedArticle>;

const defaultExtract: ArticleExtractFn = (url) => extract(url);

export async function extractArticleText(
  url: string,
  extractFn: ArticleExtractFn = defaultExtract
): Promise<string> {
  const article = await extractFn(url);
  const content = article?.content;

  if (!content) {
    throw new Error(`No article content extracted for ${url}`);
  }

  return stripHtml(content);
}
