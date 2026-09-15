import { describe, it, expect, vi, beforeEach } from "vitest";
import { setLocaleAction } from "./i18n-actions";
import { COOKIE_NAME } from "./i18n-server";

// Mock next/headers cookies
const mockSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({
    set: mockSet,
  })),
}));

// Mock dictionaries hasLocale
vi.mock("./dictionaries", () => ({
  hasLocale: vi.fn((locale: string) => locale === "id" || locale === "en"),
}));

describe("setLocaleAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should set cookie when locale is valid", async () => {
    await setLocaleAction("en");

    expect(mockSet).toHaveBeenCalledWith(COOKIE_NAME, "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  });

  it("should throw an error when locale is invalid", async () => {
    await expect(setLocaleAction("invalid" as never)).rejects.toThrow("Invalid locale: invalid");
    expect(mockSet).not.toHaveBeenCalled();
  });
});
