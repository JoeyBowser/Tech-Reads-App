import { describe, expect, it } from "vitest";
import { getMutedSources, isSourceMuted, toggleMutedSource } from "./sourceFilter";

describe("sourceFilter", () => {
  it("has no muted sources by default", () => {
    expect(getMutedSources()).toEqual([]);
    expect(isSourceMuted("Wired")).toBe(false);
  });

  it("mutes a source on toggle", () => {
    toggleMutedSource("Wired");

    expect(isSourceMuted("Wired")).toBe(true);
    expect(getMutedSources()).toEqual(["Wired"]);
  });

  it("unmutes on a second toggle", () => {
    toggleMutedSource("Wired");
    toggleMutedSource("Wired");

    expect(isSourceMuted("Wired")).toBe(false);
    expect(getMutedSources()).toEqual([]);
  });
});
