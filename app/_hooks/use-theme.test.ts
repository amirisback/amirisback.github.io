import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./use-theme";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn(() => null),
  };
})();

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
  matches: query === "(prefers-color-scheme: dark)" ? false : false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe("useTheme", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    Object.defineProperty(window, "matchMedia", { value: matchMediaMock });
    document.documentElement.classList.remove("dark", "light");
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
  });

  it("should default to system theme when no stored preference", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("system");
  });

  it("should read stored theme from localStorage", () => {
    localStorageMock.setItem("theme-preference", "dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("should apply dark class to documentElement when theme is dark", () => {
    localStorageMock.setItem("theme-preference", "dark");

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("should apply light class to documentElement when theme is light", () => {
    localStorageMock.setItem("theme-preference", "light");

    renderHook(() => useTheme());

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should persist theme choice to localStorage when setTheme is called", () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "theme-preference",
      "dark",
    );
    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("should toggle theme in sequence: light → dark → system → light", () => {
    localStorageMock.setItem("theme-preference", "light");
    const { result } = renderHook(() => useTheme());

    // light → dark
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");

    // dark → system
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("system");

    // system → light
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("light");
  });

  it("should resolve system theme to light when OS prefers light", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false, // OS prefers light
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("system");
    });

    expect(result.current.resolvedTheme).toBe("light");
  });

  it("should resolve system theme to dark when OS prefers dark", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("system");
    });

    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("should ignore invalid stored values and default to system", () => {
    localStorageMock.setItem("theme-preference", "invalid-value");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("system");
  });
});
