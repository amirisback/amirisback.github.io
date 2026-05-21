import { describe, it, expect } from "vitest";
import { getThemeInitScript } from "./theme-init";

describe("getThemeInitScript", () => {
  it("should return a non-empty string", () => {
    const script = getThemeInitScript();

    expect(script).toBeTruthy();
    expect(typeof script).toBe("string");
    expect(script.length).toBeGreaterThan(0);
  });

  it("should contain localStorage access for theme-preference", () => {
    const script = getThemeInitScript();

    expect(script).toContain("theme-preference");
    expect(script).toContain("localStorage");
  });

  it("should check for dark and light values", () => {
    const script = getThemeInitScript();

    expect(script).toContain("dark");
    expect(script).toContain("light");
  });

  it("should reference prefers-color-scheme media query", () => {
    const script = getThemeInitScript();

    expect(script).toContain("prefers-color-scheme");
  });

  it("should be wrapped in an IIFE for safe execution", () => {
    const script = getThemeInitScript();

    // Should be self-invoking function
    expect(script).toMatch(/^\(function\(\)\{/);
    expect(script).toMatch(/\}\)\(\);$/);
  });

  it("should include try-catch for error handling", () => {
    const script = getThemeInitScript();

    expect(script).toContain("try");
    expect(script).toContain("catch");
  });

  it("should add class to document.documentElement", () => {
    const script = getThemeInitScript();

    expect(script).toContain("document.documentElement.classList.add");
  });
});
