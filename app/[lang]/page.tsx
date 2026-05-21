import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { generateWebsiteJsonLd } from "@/lib/seo";
import { readContent } from "@/lib/content";
import type { Locale } from "@/i18n/config";

// Component imports
import { Navbar } from "./_components/navbar";
import { Hero } from "./_components/hero";
import { About } from "./_components/about";
import { Projects } from "./_components/projects";
import { Experience } from "./_components/experience";
import { Blog } from "./_components/blog";
import { Footer } from "./_components/footer";
import { BackToTop } from "./_components/back-to-top";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  // Load translations & portfolio JSON content
  const dict = await getDictionary(lang);
  const content = await readContent();
  const websiteJsonLd = generateWebsiteJsonLd(lang as Locale);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 antialiased selection:bg-cyan-500 selection:text-white">
      {/* JSON-LD Structured Data — WebSite (for Google Sitelinks Search Box) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />

      {/* Sticky header navbar */}
      <Navbar
        brand={content.navbar.brand}
        links={content.navbar.links}
        dict={dict}
        currentLang={lang as Locale}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero data={content.hero} />

        {/* About Section */}
        <About data={content.about} dict={dict} />

        {/* Projects Section */}
        <Projects data={content.services} dict={dict} />

        {/* Experience Section */}
        <Experience data={content.experience} dict={dict} />

        {/* Blog Section */}
        <Blog data={content.blog} dict={dict} />
      </main>

      {/* Footer Section */}
      <Footer data={content.footer} dict={dict} />

      {/* Scroll back to top button */}
      <BackToTop />
    </div>
  );
}
