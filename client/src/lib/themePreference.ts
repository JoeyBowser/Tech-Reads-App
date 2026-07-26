const STORAGE_KEY = "techReads.theme";

export type Theme = "light" | "dark" | "system";
const THEMES: Theme[] = ["light", "dark", "system"];
const DEFAULT_THEME: Theme = "system";

export function getStoredTheme(): Theme {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return THEMES.includes(raw as Theme) ? (raw as Theme) : DEFAULT_THEME;
}

export function setStoredTheme(theme: Theme): void {
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme): void {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
