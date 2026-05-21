import type { MetadataRoute } from "next";
import { i18n } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Add all your static routes here
// When you add a new page, add it to this array
const staticRoutes = [
  "",          // Homepage
  // "/about",
  // "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    for (const locale of i18n.locales) {
      const languages: Record<string, string> = {};

      // Generate hreflang alternates for each locale
      for (const altLocale of i18n.locales) {
        languages[altLocale] = `${SITE_URL}/${altLocale}${route}`;
      }

      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
