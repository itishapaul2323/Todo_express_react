import { useEffect, useState } from "react";
import { applyTheme, THEME_STORAGE_KEY } from "../theme";

function readTheme() {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(readTheme);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        setMode(e.newValue);
        if (e.newValue === "light") {
          document.documentElement.setAttribute("data-theme", "light");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function toggle() {
    const next = mode === "dark" ? "light" : "dark";
    applyTheme(next);
    setMode(next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mode === "dark" ? "Light mode" : "Dark mode"}
    >
      {mode === "dark" ? (
        <span className="theme-toggle__icon" aria-hidden>
          ☀
        </span>
      ) : (
        <span className="theme-toggle__icon" aria-hidden>
          ☽
        </span>
      )}
    </button>
  );
}
