import type { Metadata } from "next";
import { getCurrentDictionary } from "@/lib/i18n-server";
import { CvView } from "./cv-view";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getCurrentDictionary();

  const title =
    locale === "id"
      ? "Curriculum Vitae — Muhammad Faisal Amir | Senior Android & Software Engineer"
      : "Curriculum Vitae — Muhammad Faisal Amir | Senior Android & Software Engineer";

  const description =
    locale === "id"
      ? "Resume dan Curriculum Vitae profesional Muhammad Faisal Amir. Senior Android Developer & Software Engineer berpengalaman 6+ tahun dalam ekosistem Android Native dan Web Modern."
      : "Professional Curriculum Vitae & Resume of Muhammad Faisal Amir. Senior Android Developer & Software Engineer with 6+ years of experience in Native Android & Modern Web.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      firstName: "Muhammad Faisal",
      lastName: "Amir",
      username: "amirisback",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CvPage() {
  const { locale, dict } = await getCurrentDictionary();

  return <CvView initialLocale={locale} dict={dict} />;
}
