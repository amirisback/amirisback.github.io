import "server-only";
import { cookies } from "next/headers";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "@/lib/dictionaries";

export const COOKIE_NAME = "NEXT_LOCALE";

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(COOKIE_NAME)?.value;

  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  return i18n.defaultLocale;
}

export async function getCurrentDictionary() {
  const locale = await getCurrentLocale();
  const dict = await getDictionary(locale);
  return { locale, dict };
}
