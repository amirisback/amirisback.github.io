"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { cvData, type CvContentLocale } from "./cv-data";
import { setLocaleAction } from "@/lib/i18n-actions";
import type { Locale } from "@/i18n/config";

interface CvViewProps {
  initialLocale: Locale;
  dict: {
    cv?: {
      title?: string;
      subtitle?: string;
      backToHome?: string;
      printCv?: string;
      downloadPdf?: string;
      downloadEnPdf?: string;
      downloadIdPdf?: string;
      printTip?: string;
      language?: string;
      summaryTitle?: string;
      skillsTitle?: string;
      experienceTitle?: string;
      projectsTitle?: string;
      educationTitle?: string;
      languagesTitle?: string;
      present?: string;
    };
  };
}

export function CvView({ initialLocale, dict }: CvViewProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(
    initialLocale === "en" ? "en" : "id"
  );
  const [, startTransition] = useTransition();

  const activeLocaleData: CvContentLocale = cvData[currentLocale];
  const cvDict = dict.cv || {};

  const handleLanguageSwitch = (newLocale: Locale) => {
    setCurrentLocale(newLocale);
    startTransition(async () => {
      try {
        await setLocaleAction(newLocale);
      } catch (err) {
        console.error("Failed to persist locale:", err);
      }
    });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-white print:bg-white print:text-black">
      {/* ── Fixed / Sticky Action Bar (Hidden on Print) ── */}
      <header
        role="banner"
        className="no-print sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs px-4 py-3"
      >
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Navigation Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors py-1.5 px-2.5 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
            aria-label={cvDict.backToHome || "Back to Home"}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>{cvDict.backToHome || "Back to Home"}</span>
          </Link>

          {/* Action Buttons & Locale Switcher */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Language Switcher */}
            <div
              className="inline-flex items-center border border-zinc-300 dark:border-zinc-700 rounded-sm p-0.5 bg-zinc-50 dark:bg-zinc-800"
              role="group"
              aria-label={cvDict.language || "Resume Language"}
            >
              <button
                type="button"
                onClick={() => handleLanguageSwitch("en")}
                aria-pressed={currentLocale === "en"}
                className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  currentLocale === "en"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch("id")}
                aria-pressed={currentLocale === "id"}
                className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  currentLocale === "id"
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                ID
              </button>
            </div>

            {/* Static PDF Download Link */}
            <a
              href={activeLocaleData.staticPdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-900"
              title={cvDict.downloadPdf || "Download PDF File"}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>{cvDict.downloadPdf || "Download PDF"}</span>
            </a>

            {/* Print / Save PDF Primary Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors rounded-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>{cvDict.printCv || "Print / Save as PDF"}</span>
            </button>
          </div>
        </div>

        {/* Subtle Hint / Tip for PDF print */}
        <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between gap-2">
          <span>{cvDict.printTip || "Tip: Select 'Save as PDF' with Background Graphics enabled and Margins: Default."}</span>
          <span className="hidden sm:inline font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">
            A4 Standard Format
          </span>
        </div>
      </header>

      {/* ── Document Container (The Sheet) ── */}
      <main className="py-6 sm:py-10 px-3 sm:px-6 print:p-0">
        <article
          id="cv-printable-content"
          className="cv-document max-w-[850px] mx-auto bg-white text-black border border-zinc-200 print:border-none p-6 sm:p-12 shadow-xs print:shadow-none print:p-0 print:max-w-none"
        >
          {/* Header Section */}
          <header className="border-b-2 border-black pb-4 mb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
              {activeLocaleData.fullName}
            </h1>
            <p className="text-sm sm:text-base font-semibold uppercase tracking-wider text-zinc-700 mt-1">
              {activeLocaleData.roleTitle}
            </p>

            {/* Coordinates / Contact Matrix */}
            <div className="mt-3.5 pt-3 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-zinc-700 font-mono">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900">Loc:</span>
                <span className="truncate">{activeLocaleData.contact.location}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900">Email:</span>
                <a
                  href={`mailto:${activeLocaleData.contact.email}`}
                  className="truncate hover:underline text-black"
                >
                  {activeLocaleData.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900">Tel:</span>
                <a
                  href={activeLocaleData.contact.phoneUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline text-black"
                >
                  {activeLocaleData.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900">GitHub:</span>
                <a
                  href={activeLocaleData.contact.gitHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline text-black"
                >
                  {activeLocaleData.contact.gitHub}
                </a>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900">LinkedIn:</span>
                <a
                  href={activeLocaleData.contact.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline text-black"
                >
                  {activeLocaleData.contact.linkedIn}
                </a>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-zinc-900">Web:</span>
                <a
                  href={activeLocaleData.contact.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate hover:underline text-black"
                >
                  {activeLocaleData.contact.portfolio}
                </a>
              </div>
            </div>
          </header>

          {/* Section: Professional Summary */}
          <section className="cv-section-block mb-6 break-inside-avoid">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
              {cvDict.summaryTitle || "Professional Summary"}
            </h2>
            <p className="text-xs sm:text-[13px] leading-relaxed text-zinc-800 text-justify">
              {activeLocaleData.summary}
            </p>
          </section>

          {/* Section: Core Competencies & Skills */}
          <section className="cv-section-block mb-6 break-inside-avoid">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2.5">
              {cvDict.skillsTitle || "Core Competencies & Technical Skills"}
            </h2>
            <div className="space-y-1.5 text-xs sm:text-[12.5px] leading-normal text-zinc-800">
              {activeLocaleData.skills.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-0.5 sm:gap-2">
                  <span className="font-bold text-zinc-950 sm:min-w-[170px] shrink-0">
                    {item.category}:
                  </span>
                  <span className="text-zinc-700">{item.skills}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Professional Experience */}
          <section className="cv-section-block mb-6">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
              {cvDict.experienceTitle || "Professional Experience"}
            </h2>
            <div className="space-y-4">
              {activeLocaleData.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="cv-experience-item break-inside-avoid page-break-inside-avoid"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xs sm:text-[13.5px] font-bold text-black">
                      {exp.company}
                      <span className="font-normal text-zinc-600"> — {exp.location}</span>
                    </h3>
                    <span className="text-xs font-mono font-medium text-zinc-600 shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-zinc-800 italic mt-0.5">
                    {exp.role}
                  </div>
                  <ul className="mt-2 space-y-1 text-xs sm:text-[12.5px] text-zinc-800 list-disc list-outside ml-4 leading-relaxed">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Open-Source Contributions & Projects */}
          <section className="cv-section-block mb-6 break-inside-avoid">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
              {cvDict.projectsTitle || "Open-Source & Noteworthy Projects"}
            </h2>
            <div className="space-y-3">
              {activeLocaleData.openSource.map((proj, idx) => (
                <div key={idx} className="cv-project-item">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-black">
                      {proj.title}
                      {proj.role && (
                        <span className="font-normal text-zinc-600 italic"> — {proj.role}</span>
                      )}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-zinc-500 hover:text-black hover:underline"
                      >
                        {proj.link.replace("https://", "")}
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-800 mt-1 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}

              {/* Technical Publications */}
              {activeLocaleData.publications.map((pub, idx) => (
                <div key={`pub-${idx}`} className="cv-project-item pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-black">
                      {pub.title}
                      <span className="font-normal text-zinc-600 italic"> — {pub.role}</span>
                    </h3>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-zinc-500 hover:text-black hover:underline"
                      >
                        {pub.link.replace("https://", "")}
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-800 mt-1 leading-relaxed">
                    {pub.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Education */}
          <section className="cv-section-block mb-6 break-inside-avoid">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-3">
              {cvDict.educationTitle || "Education & Credentials"}
            </h2>
            <div className="space-y-3">
              {activeLocaleData.education.map((edu, idx) => (
                <div key={idx} className="cv-education-item">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xs sm:text-[13px] font-bold text-black">
                      {edu.institution}
                      <span className="font-normal text-zinc-600"> — {edu.location}</span>
                    </h3>
                    <span className="text-xs font-mono font-medium text-zinc-600 shrink-0">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-800 italic mt-0.5">{edu.degree}</div>
                  {edu.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs text-zinc-700 list-disc list-outside ml-4">
                      {edu.highlights.map((hl, hIdx) => (
                        <li key={hIdx}>{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section: Languages */}
          <section className="cv-section-block break-inside-avoid">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black border-b border-black pb-1 mb-2">
              {cvDict.languagesTitle || "Languages"}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-800">
              {activeLocaleData.languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="font-bold text-black">{lang.name}:</span>
                  <span className="text-zinc-700">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
