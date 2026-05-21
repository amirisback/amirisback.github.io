import { notFound } from "next/navigation";
import { hasLocale } from "../dictionaries";
import { readContent } from "@/lib/content";
import { CmsDashboard } from "./cms-dashboard";
import type { Locale } from "@/i18n/config";

export default async function CmsPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const initialContent = await readContent();

  return (
    <CmsDashboard
      initialContent={initialContent}
      lang={lang as Locale}
    />
  );
}
