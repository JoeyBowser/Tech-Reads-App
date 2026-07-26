import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, getStoredTheme, setStoredTheme } from "./themePreference";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

describe("themePreference", () => {
  it("defaults to system when nothing is stored", () => {
    expect(getStoredTheme()).toBe("system");
  });

  it("round-trips a valid stored value", () => {
    setStoredTheme("dark");
    expect(getStoredTheme()).toBe("dark");
  });

  it("falls back to system for garbage input", () => {
    window.localStorage.setItem("techReads.theme", "not-a-theme");
    expect(getStoredTheme()).toBe("system");
  });
});

describe("applyTheme", () => {
  it("sets data-theme for light and dark", () => {
    applyTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("clears data-theme for system", () => {
    applyTheme("dark");
    applyTheme("system");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });
});
