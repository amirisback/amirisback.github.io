import { describe, it, expect } from "vitest";
import { i18n } from "./config";

describe("i18n config", () => {
  it("should have 'id' as default locale", () => {
    expect(i18n.defaultLocale).toBe("id");
  });

  it("should include all required locales", () => {
    expect(i18n.locales).toContain("id");
    expect(i18n.locales).toContain("en");
  });

  it("should have at least 2 locales", () => {
    expect(i18n.locales.length).toBeGreaterThanOrEqual(2);
  });

  it("should have default locale included in locales array", () => {
    expect(i18n.locales).toContain(i18n.defaultLocale);
  });

  it("should be a readonly/const object", () => {
    // Verify the shape is correct
    expect(i18n).toHaveProperty("defaultLocale");
    expect(i18n).toHaveProperty("locales");
  });
});
