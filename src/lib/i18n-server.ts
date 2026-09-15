import "server-only";
import { cookies } from "next/headers";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/lib/dictionaries";

export const COOKIE_NAME = "NEXT_LOCALE";

export async function getCurrentLocale(): Promise<Locale> {
  if (process.env.OUTPUT_EXPORT === "true") {
    return i18n.defaultLocale;
  }

  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;

    if (cookieLocale && hasLocale(cookieLocale)) {
      return cookieLocale;
    }
  } catch {
    // In static export or SSR without request context, fallback to defaultLocale
  }

  return i18n.defaultLocale;
}

export async function getCurrentDictionary() {
  const locale = await getCurrentLocale();
  const dict = await getDictionary(locale);
  return { locale, dict };
}
