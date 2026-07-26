import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SaveToggleButton } from "./SaveToggleButton";
import { isSaved } from "../lib/savedStories";
import type { Story } from "../types";

const story: Story = {
  id: "s1",
  title: "A Story",
  summary: "Summary.",
  source: "TestSource",
  url: "https://example.com/a",
  publishedAt: "2026-07-24T00:00:00.000Z"
};

describe("SaveToggleButton", () => {
  it("saves the story, updates its own label, and calls onToggle", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<SaveToggleButton story={story} onToggle={onToggle} />);

    expect(screen.getByRole("button")).toHaveTextContent(/save/i);

    await user.click(screen.getByRole("button"));

    expect(isSaved(story.url)).toBe(true);
    expect(screen.getByRole("button")).toHaveTextContent(/saved/i);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("unsaves on a second click", async () => {
    const user = userEvent.setup();
    render(<SaveToggleButton story={story} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(isSaved(story.url)).toBe(false);
  });
});
