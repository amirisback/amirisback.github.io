// SEO configuration and helpers
// Centralized SEO settings used across the application

import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { i18n } from "@/i18n/config";

// Base URL for the site — update in .env for production
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Amir App";

export const seoConfig = {
  siteUrl: SITE_URL,
  siteName: SITE_NAME,
  defaultLocale: i18n.defaultLocale,
  locales: i18n.locales,
} as const;

/**
 * Generate locale alternates for hreflang tags
 * This tells search engines about all language versions of a page
 */
export function generateAlternates(pathname: string) {
  const languages: Record<string, string> = {};

  for (const locale of seoConfig.locales) {
    languages[locale] = `${seoConfig.siteUrl}/${locale}${pathname}`;
  }

  return {
    canonical: `${seoConfig.siteUrl}/${seoConfig.defaultLocale}${pathname}`,
    languages,
  };
}

/**
 * Generate Open Graph metadata for a page
 */
export function generateOgMetadata({
  title,
  description,
  locale,
  pathname = "",
  images,
}: {
  title: string;
  description: string;
  locale: Locale;
  pathname?: string;
  images?: string[];
}): Metadata["openGraph"] {
  return {
    title,
    description,
    siteName: seoConfig.siteName,
    locale: locale === "id" ? "id_ID" : "en_US",
    alternateLocale: seoConfig.locales
      .filter((l) => l !== locale)
      .map((l) => (l === "id" ? "id_ID" : "en_US")),
    type: "website",
    url: `${seoConfig.siteUrl}/${locale}${pathname}`,
    images: images ?? [
      {
        url: `${seoConfig.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterMetadata({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images?: string[];
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: images ?? [`${seoConfig.siteUrl}/og-image.png`],
  };
}

/**
 * Generate JSON-LD structured data for a WebSite
 */
export function generateWebsiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: `${seoConfig.siteUrl}/${locale}`,
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${seoConfig.siteUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate JSON-LD structured data for an Organization
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/icon-512x512.svg`,
  };
}

/**
 * Generate full SEO metadata for a page
 * Combines title, description, Open Graph, Twitter, alternates
 */
export function generatePageSeo({
  title,
  description,
  locale,
  pathname = "",
  images,
  noIndex = false,
}: {
  title: string;
  description: string;
  locale: Locale;
  pathname?: string;
  images?: string[];
  noIndex?: boolean;
}): Metadata {
  const fullTitle = pathname === "" ? title : `${title} — ${seoConfig.siteName}`;

  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: fullTitle,
    description,
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1 },
    icons: {
      icon: [
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { url: '/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
      ],
    },
    alternates: generateAlternates(pathname),
    openGraph: generateOgMetadata({ title: fullTitle, description, locale, pathname, images }),
    twitter: generateTwitterMetadata({ title: fullTitle, description, images }),
  };
}
