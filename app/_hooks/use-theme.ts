"use client";

import { useCallback, useEffect, useState } from "react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    orig.apply(console, args);
  };
}

/** Possible theme values */
export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

/**
 * Resolve what the effective appearance should be.
 * "system" resolves to the OS preference; otherwise returns the explicit value.
 */
function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

/**
 * Apply the correct class to the `<html>` element.
 */
function applyThemeToDOM(resolved: "light" | "dark"): void {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

/**
 * Read the persisted theme from localStorage, falling back to "system".
 */
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

/**
 * Hook that manages theme toggling with three modes: light / dark / system.
 *
 * - Persists the user's choice in localStorage.
 * - Applies the `.dark` or `.light` class to `<html>`.
 * - Listens for OS-preference changes when in "system" mode.
 *
 * @returns `{ theme, resolvedTheme, setTheme, toggleTheme }`
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // ── initialise from localStorage ──
  useEffect(() => {
    const stored = getStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(stored);
    const resolved = resolveTheme(stored);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
  }, []);

  // ── listen for OS-preference changes in "system" mode ──
  useEffect(() => {
    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  // ── public setter ──
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    const resolved = resolveTheme(next);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
  }, []);

  // ── convenience toggle: light → dark → system → light ──
  const toggleTheme = useCallback(() => {
    setTheme(
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light",
    );
  }, [theme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggleTheme } as const;
}
