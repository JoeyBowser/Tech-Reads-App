import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relativeTime";

const NOW = new Date("2026-07-25T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("shows 'just now' for under a minute", () => {
    expect(formatRelativeTime("2026-07-25T11:59:45.000Z", NOW)).toBe("just now");
  });

  it("shows minutes for under an hour", () => {
    expect(formatRelativeTime("2026-07-25T11:45:00.000Z", NOW)).toBe("15m ago");
  });

  it("shows hours for under a day", () => {
    expect(formatRelativeTime("2026-07-25T09:00:00.000Z", NOW)).toBe("3h ago");
  });

  it("shows days for under a week", () => {
    expect(formatRelativeTime("2026-07-23T12:00:00.000Z", NOW)).toBe("2d ago");
  });

  it("shows a calendar date beyond a week", () => {
    expect(formatRelativeTime("2026-07-01T12:00:00.000Z", NOW)).toBe(
      new Date("2026-07-01T12:00:00.000Z").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })
    );
  });
});
