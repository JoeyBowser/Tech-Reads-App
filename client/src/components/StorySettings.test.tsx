import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StorySettings } from "./StorySettings";

describe("StorySettings", () => {
  it("shows the current count as selected", () => {
    render(<StorySettings count={10} onChange={vi.fn()} onRefresh={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveValue("10");
  });

  it("calls onChange with the newly selected count", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StorySettings count={5} onChange={onChange} onRefresh={vi.fn()} />);

    await user.selectOptions(screen.getByRole("combobox"), "12");

    expect(onChange).toHaveBeenCalledWith(12);
  });

  it("calls onRefresh when the refresh button is clicked", async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<StorySettings count={5} onChange={vi.fn()} onRefresh={onRefresh} />);

    await user.click(screen.getByRole("button", { name: /refresh/i }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
