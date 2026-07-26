import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { App } from "./App";
import { mockStories, server } from "./test/mswServer";
import { getStoredStoryCount } from "./lib/storyCountPreference";

describe("App", () => {
  it("renders 5 story cards after loading", async () => {
    render(<App />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    const cards = await screen.findAllByRole("listitem");
    expect(cards).toHaveLength(5);
  });

  it("shows a story's summary and a working external link when selected, then returns to the list on back", async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstTitle = await screen.findByText("Story 0");
    await user.click(firstTitle);

    expect(await screen.findByText("Summary text for story 0.")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /read full article/i });
    expect(link).toHaveAttribute("href", "https://example.com/story-0");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));

    await user.click(screen.getByRole("button", { name: /back/i }));

    expect(await screen.findAllByRole("listitem")).toHaveLength(5);
  });

  it("updates the visible count and persists it when the setting changes, without refetching", async () => {
    let requestCount = 0;
    server.use(
      http.get("/api/stories", ({ request }) => {
        requestCount += 1;
        const count = Number(new URL(request.url).searchParams.get("count")) || 5;
        return HttpResponse.json({ stories: mockStories.slice(0, count) });
      })
    );

    const user = userEvent.setup();
    render(<App />);

    await screen.findAllByRole("listitem");
    expect(requestCount).toBe(1);

    await user.selectOptions(screen.getByRole("combobox"), "10");

    expect(await screen.findAllByRole("listitem")).toHaveLength(10);
    expect(getStoredStoryCount()).toBe(10);
    expect(requestCount).toBe(1);
  });

  it("fetches a fresh set of stories when Refresh is clicked", async () => {
    let requestCount = 0;
    server.use(
      http.get("/api/stories", ({ request }) => {
        requestCount += 1;
        const count = Number(new URL(request.url).searchParams.get("count")) || 5;
        return HttpResponse.json({ stories: mockStories.slice(0, count) });
      })
    );

    const user = userEvent.setup();
    render(<App />);

    await screen.findAllByRole("listitem");
    expect(requestCount).toBe(1);

    await user.click(screen.getByRole("button", { name: /refresh/i }));

    await waitFor(() => expect(requestCount).toBe(2));
  });

  it("shows an error message when the request fails", async () => {
    server.use(
      http.get("/api/stories", () => HttpResponse.json({ message: "boom" }, { status: 500 }))
    );

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't load stories/i);
  });

  it("dims a story in the list after it has been opened", async () => {
    const user = userEvent.setup();
    render(<App />);

    const firstTitle = await screen.findByText("Story 0");
    await user.click(firstTitle);
    await user.click(screen.getByRole("button", { name: /back/i }));

    const cards = await screen.findAllByRole("listitem");
    expect(cards[0]).toHaveClass("story-card--read");
  });

  it("saves a story from the list and shows it under the Saved tab", async () => {
    const user = userEvent.setup();
    render(<App />);

    const cards = await screen.findAllByRole("listitem");
    const firstCardSaveButton = within(cards[0]).getByRole("button", { name: /save/i });
    await user.click(firstCardSaveButton);

    await user.click(screen.getByRole("button", { name: /^saved/i }));

    expect(await screen.findByText("Story 0")).toBeInTheDocument();
    expect(screen.queryByText("Story 1")).not.toBeInTheDocument();
  });

  it("hides stories from a muted source", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText("Story 0");

    await user.click(screen.getByRole("button", { name: "SourceB" }));

    expect(screen.queryByText("Story 0")).not.toBeInTheDocument();
    expect(await screen.findByText("Story 1")).toBeInTheDocument();
    expect(await screen.findAllByRole("listitem")).toHaveLength(5);
  });
});
