import { describe, expect, it } from "vitest";
import { clampCount, shuffle } from "./shuffle.js";

describe("shuffle", () => {
  it("returns a new array with the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);

    expect(result).not.toBe(input);
    expect(result.sort()).toEqual(input.sort());
  });
});

describe("clampCount", () => {
  it("uses the fallback when the value is not a finite number", () => {
    expect(clampCount(undefined)).toBe(5);
    expect(clampCount("not-a-number")).toBe(5);
  });

  it("clamps below the minimum", () => {
    expect(clampCount(0)).toBe(1);
    expect(clampCount(-5)).toBe(1);
  });

  it("clamps above the maximum", () => {
    expect(clampCount(100)).toBe(15);
  });

  it("truncates decimal values", () => {
    expect(clampCount("7.9")).toBe(7);
  });

  it("passes through valid values", () => {
    expect(clampCount(10)).toBe(10);
  });
});
