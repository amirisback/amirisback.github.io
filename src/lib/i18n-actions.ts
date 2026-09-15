"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME } from "./i18n-server";
import { hasLocale } from "./dictionaries";
import type { Locale } from "@/i18n/config";

export async function setLocaleAction(locale: Locale) {
  if (!hasLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
