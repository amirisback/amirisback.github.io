import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { i18n } from "@/i18n/config";
import { generatePageSeo, generateOrganizationJsonLd } from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return { title: "Amir App" };
  }

  const dict = await getDictionary(lang);

  return {
    ...generatePageSeo({
      title: dict.metadata.title,
      description: dict.metadata.description,
      locale: lang,
    }),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: dict.metadata.title,
    },
    formatDetection: {
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function LangLayout({
  children,
  params,
}: Readonly<LayoutProps<"/[lang]"> & { children: React.ReactNode }>) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
