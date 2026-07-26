import { describe, expect, it } from "vitest";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { StoryDetail } from "./StoryDetail";
import { server } from "../test/mswServer";
import type { Story } from "../types";

const story: Story = {
  id: "s1",
  title: "Test Story",
  summary: "Short summary.",
  source: "TestSource",
  url: "https://example.com/test-story",
  publishedAt: "2026-07-24T00:00:00.000Z"
};

describe("StoryDetail", () => {
  it("shows the short summary immediately, then replaces it with the full summary", async () => {
    server.use(
      http.get("/api/summary", () =>
        HttpResponse.json({ summary: "A much longer generated summary." })
      )
    );

    render(<StoryDetail story={story} onBack={() => {}} />);

    expect(screen.getByText("Short summary.")).toBeInTheDocument();
    expect(screen.getByText(/getting the full summary/i)).toBeInTheDocument();

    expect(await screen.findByText("A much longer generated summary.")).toBeInTheDocument();
    expect(screen.queryByText(/getting the full summary/i)).not.toBeInTheDocument();
  });

  it("keeps showing the short summary if the full-summary fetch fails", async () => {
    server.use(
      http.get("/api/summary", () => HttpResponse.json({ message: "boom" }, { status: 500 }))
    );

    render(<StoryDetail story={story} onBack={() => {}} />);

    expect(screen.getByText("Short summary.")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByText(/getting the full summary/i));

    expect(screen.getByText("Short summary.")).toBeInTheDocument();
  });
});
