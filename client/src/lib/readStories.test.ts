import { describe, expect, it } from "vitest";
import { isRead, markAsRead } from "./readStories";

describe("readStories", () => {
  it("is not read by default", () => {
    expect(isRead("https://example.com/a")).toBe(false);
  });

  it("marks a url as read", () => {
    markAsRead("https://example.com/a");
    expect(isRead("https://example.com/a")).toBe(true);
    expect(isRead("https://example.com/b")).toBe(false);
  });

  it("is idempotent for the same url", () => {
    markAsRead("https://example.com/a");
    markAsRead("https://example.com/a");

    const raw = window.localStorage.getItem("techReads.readUrls");
    expect(JSON.parse(raw ?? "[]")).toEqual(["https://example.com/a"]);
  });
});
