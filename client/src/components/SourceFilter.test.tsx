import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SourceFilter } from "./SourceFilter";

describe("SourceFilter", () => {
  it("renders a chip per source and calls onToggle with the clicked source", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<SourceFilter sources={["Wired", "TechCrunch"]} muted={["Wired"]} onToggle={onToggle} />);

    expect(screen.getByRole("button", { name: "Wired" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "TechCrunch" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "TechCrunch" }));

    expect(onToggle).toHaveBeenCalledWith("TechCrunch");
  });

  it("renders nothing when there are no sources", () => {
    const { container } = render(<SourceFilter sources={[]} muted={[]} onToggle={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
