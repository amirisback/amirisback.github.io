import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/i18n/config";

function getLocale(request: NextRequest): string {
  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");

  if (acceptLanguage) {
    // Parse Accept-Language and find best match
    const preferredLocales = acceptLanguage
      .split(",")
      .map((lang) => {
        const [locale, quality] = lang.trim().split(";q=");
        return {
          locale: locale.trim().toLowerCase(),
          quality: quality ? parseFloat(quality) : 1,
        };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const { locale } of preferredLocales) {
      // Exact match
      const exactMatch = i18n.locales.find((l) => l === locale);
      if (exactMatch) return exactMatch;

      // Language-only match (e.g., "en-US" -> "en")
      const langOnly = locale.split("-")[0];
      const partialMatch = i18n.locales.find((l) => l === langOnly);
      if (partialMatch) return partialMatch;
    }
  }

  return i18n.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a supported locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Skip internal paths and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/sw.js") ||
    pathname.startsWith("/manifest") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Redirect to locale-prefixed path
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip internal paths (_next), API routes, and static files
    "/((?!_next|api|.*\\..*).*)",
  ],
};
