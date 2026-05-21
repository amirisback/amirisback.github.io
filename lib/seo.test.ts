import { describe, it, expect } from "vitest";
import {
  generateAlternates,
  generateOgMetadata,
  generateTwitterMetadata,
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
  generatePageSeo,
  seoConfig,
} from "./seo";

// ============================================================
// generateAlternates
// ============================================================
describe("generateAlternates", () => {
  it("should generate canonical URL with default locale", () => {
    const result = generateAlternates("/about");
    expect(result.canonical).toContain(`/${seoConfig.defaultLocale}/about`);
  });

  it("should include all supported locales in languages", () => {
    const result = generateAlternates("/about");
    for (const locale of seoConfig.locales) {
      expect(result.languages[locale]).toBeDefined();
      expect(result.languages[locale]).toContain(`/${locale}/about`);
    }
  });

  it("should handle root pathname correctly", () => {
    const result = generateAlternates("");
    expect(result.canonical).toBe(
      `${seoConfig.siteUrl}/${seoConfig.defaultLocale}`
    );
  });

  it("should prefix all URLs with siteUrl", () => {
    const result = generateAlternates("/contact");
    for (const locale of seoConfig.locales) {
      expect(result.languages[locale]).toMatch(
        new RegExp(`^${seoConfig.siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
      );
    }
  });
});

// ============================================================
// generateOgMetadata
// ============================================================
describe("generateOgMetadata", () => {
  it("should return correct OG locale for 'id'", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result?.locale).toBe("id_ID");
  });

  it("should return correct OG locale for 'en'", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "en",
    });
    expect(result?.locale).toBe("en_US");
  });

  it("should set siteName from seoConfig", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result?.siteName).toBe(seoConfig.siteName);
  });

  it("should set type as 'website'", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result?.type).toBe("website");
  });

  it("should include alternateLocale excluding current locale", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    // alternateLocale should not include id_ID, only en_US
    expect(result?.alternateLocale).toContain("en_US");
    expect(result?.alternateLocale).not.toContain("id_ID");
  });

  it("should use provided images when given", () => {
    const customImages = ["/custom-image.png"];
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
      images: customImages,
    });
    expect(result?.images).toEqual(customImages);
  });

  it("should use default OG image when no images provided", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result?.images).toBeDefined();
    expect(Array.isArray(result?.images)).toBe(true);
  });

  it("should construct URL with pathname", () => {
    const result = generateOgMetadata({
      title: "Test",
      description: "Desc",
      locale: "en",
      pathname: "/about",
    });
    expect(result?.url).toContain("/en/about");
  });
});

// ============================================================
// generateTwitterMetadata
// ============================================================
describe("generateTwitterMetadata", () => {
  it("should return summary_large_image card type", () => {
    const result = generateTwitterMetadata({
      title: "Test",
      description: "Desc",
    });
    expect(result?.card).toBe("summary_large_image");
  });

  it("should set title and description", () => {
    const result = generateTwitterMetadata({
      title: "My Title",
      description: "My Description",
    });
    expect(result?.title).toBe("My Title");
    expect(result?.description).toBe("My Description");
  });

  it("should include OG image in images array", () => {
    const result = generateTwitterMetadata({
      title: "Test",
      description: "Desc",
    });
    expect(result?.images).toBeDefined();
    expect(Array.isArray(result?.images)).toBe(true);
    expect((result?.images as string[]).length).toBeGreaterThan(0);
  });
});

// ============================================================
// generateWebsiteJsonLd
// ============================================================
describe("generateWebsiteJsonLd", () => {
  it("should return WebSite schema type", () => {
    const result = generateWebsiteJsonLd("id");
    expect(result["@type"]).toBe("WebSite");
    expect(result["@context"]).toBe("https://schema.org");
  });

  it("should set correct inLanguage for 'id'", () => {
    const result = generateWebsiteJsonLd("id");
    expect(result.inLanguage).toBe("id-ID");
  });

  it("should set correct inLanguage for 'en'", () => {
    const result = generateWebsiteJsonLd("en");
    expect(result.inLanguage).toBe("en-US");
  });

  it("should include search action with url template", () => {
    const result = generateWebsiteJsonLd("id");
    expect(result.potentialAction).toBeDefined();
    expect(result.potentialAction["@type"]).toBe("SearchAction");
  });

  it("should include locale in URL", () => {
    const result = generateWebsiteJsonLd("en");
    expect(result.url).toContain("/en");
  });
});

// ============================================================
// generateOrganizationJsonLd
// ============================================================
describe("generateOrganizationJsonLd", () => {
  it("should return Organization schema type", () => {
    const result = generateOrganizationJsonLd();
    expect(result["@type"]).toBe("Organization");
    expect(result["@context"]).toBe("https://schema.org");
  });

  it("should use siteUrl for url", () => {
    const result = generateOrganizationJsonLd();
    expect(result.url).toBe(seoConfig.siteUrl);
  });

  it("should use siteName for name", () => {
    const result = generateOrganizationJsonLd();
    expect(result.name).toBe(seoConfig.siteName);
  });

  it("should include logo URL", () => {
    const result = generateOrganizationJsonLd();
    expect(result.logo).toContain(seoConfig.siteUrl);
    expect(result.logo).toContain("icon-512x512.svg");
  });
});

// ============================================================
// generatePageSeo
// ============================================================
describe("generatePageSeo", () => {
  it("should set noIndex robots when noIndex is true", () => {
    const result = generatePageSeo({
      title: "Test",
      description: "Desc",
      locale: "id",
      noIndex: true,
    });
    expect(result.robots).toEqual({ index: false, follow: false });
  });

  it("should set indexable robots when noIndex is false", () => {
    const result = generatePageSeo({
      title: "Test",
      description: "Desc",
      locale: "id",
      noIndex: false,
    });
    expect(result.robots).toMatchObject({ index: true, follow: true });
  });

  it("should append siteName for non-root pages", () => {
    const result = generatePageSeo({
      title: "About",
      description: "About page",
      locale: "id",
      pathname: "/about",
    });
    expect(result.title).toContain("About");
    expect(result.title).toContain(seoConfig.siteName);
  });

  it("should use title without siteName for root page", () => {
    const result = generatePageSeo({
      title: "Home Title",
      description: "Home",
      locale: "id",
      pathname: "",
    });
    expect(result.title).toBe("Home Title");
  });

  it("should include alternates", () => {
    const result = generatePageSeo({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result.alternates).toBeDefined();
    expect(result.alternates?.canonical).toBeDefined();
  });

  it("should include openGraph metadata", () => {
    const result = generatePageSeo({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result.openGraph).toBeDefined();
  });

  it("should include twitter metadata", () => {
    const result = generatePageSeo({
      title: "Test",
      description: "Desc",
      locale: "id",
    });
    expect(result.twitter).toBeDefined();
  });
});

// ============================================================
// seoConfig
// ============================================================
describe("seoConfig", () => {
  it("should have required properties", () => {
    expect(seoConfig).toHaveProperty("siteUrl");
    expect(seoConfig).toHaveProperty("siteName");
    expect(seoConfig).toHaveProperty("defaultLocale");
    expect(seoConfig).toHaveProperty("locales");
  });

  it("should have siteUrl as a valid URL string", () => {
    expect(typeof seoConfig.siteUrl).toBe("string");
    expect(seoConfig.siteUrl).toMatch(/^https?:\/\//);
  });
});
