import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCurrentLocale, getCurrentDictionary, COOKIE_NAME } from "./i18n-server";
import { i18n } from "@/i18n/config";

// Mock next/headers cookies
const mockGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => Promise.resolve({
    get: mockGet,
  })),
}));

// Mock dictionaries
vi.mock("@/lib/dictionaries", () => ({
  hasLocale: vi.fn((locale: string) => locale === "id" || locale === "en"),
  getDictionary: vi.fn(async (locale: string) => ({
    common: { appName: `App-${locale}` },
  })),
}));

describe("i18n-server", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return default locale when cookie is absent", async () => {
    mockGet.mockReturnValue(undefined);

    const locale = await getCurrentLocale();

    expect(locale).toBe(i18n.defaultLocale);
    expect(mockGet).toHaveBeenCalledWith(COOKIE_NAME);
  });

  it("should return cookie locale when valid cookie exists", async () => {
    mockGet.mockReturnValue({ value: "en" });

    const locale = await getCurrentLocale();

    expect(locale).toBe("en");
    expect(mockGet).toHaveBeenCalledWith(COOKIE_NAME);
  });

  it("should fallback to default locale when cookie has invalid locale", async () => {
    mockGet.mockReturnValue({ value: "fr" });

    const locale = await getCurrentLocale();

    expect(locale).toBe(i18n.defaultLocale);
  });

  it("should return current dictionary and locale", async () => {
    mockGet.mockReturnValue({ value: "en" });

    const result = await getCurrentDictionary();

    expect(result.locale).toBe("en");
    expect(result.dict.common.appName).toBe("App-en");
  });
});
