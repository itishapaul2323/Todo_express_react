export const THEME_STORAGE_KEY = "todo-theme";

const THEME_COLOR = {
  dark: "#050807",
  light: "#f0fdf4",
};

/** @returns {"dark" | "light"} */
export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return "dark";
}

/** @param {"dark" | "light"} theme */
export function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", THEME_COLOR[theme] ?? THEME_COLOR.dark);
  }
}
