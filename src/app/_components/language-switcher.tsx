"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/lib/i18n-actions";
import type { Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale || isPending) return;

    startTransition(async () => {
      await setLocaleAction(newLocale);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-zinc-200 dark:border-zinc-700/60 shadow-xs">
      <button
        type="button"
        onClick={() => handleLanguageChange("id")}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          currentLocale === "id"
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs scale-[1.02]"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        } ${isPending ? "opacity-60 cursor-wait" : ""}`}
        aria-label="Bahasa Indonesia"
      >
        <span>🇮🇩</span>
        <span>ID</span>
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          currentLocale === "en"
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs scale-[1.02]"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        } ${isPending ? "opacity-60 cursor-wait" : ""}`}
        aria-label="English (US)"
      >
        <span>🇺🇸</span>
        <span>EN</span>
      </button>
    </div>
  );
}
