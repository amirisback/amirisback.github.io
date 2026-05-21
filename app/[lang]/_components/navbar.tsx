"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  brand: string;
  links: Array<{ href: string; label: string }>;
  dict: {
    nav: {
      home: string;
      about: string;
      contact: string;
      project: string;
      experience: string;
      blog: string;
      language: string;
    };
  };
  currentLang: Locale;
}

export function Navbar({ brand, links, dict, currentLang }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);

      // Simple active link detection
      const sections = links.map((link) => link.href.substring(1));
      let currentSection = "#home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = `#${section}`;
            break;
          }
        }
      }
      setActiveHash(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  const changeLanguage = (newLang: Locale) => {
    if (!pathname) return;
    const segments = pathname.split("/");
    segments[1] = newLang; // replace locale segment
    const newPath = segments.join("/");
    router.push(newPath);
  };

  const getLinkLabel = (href: string, fallback: string) => {
    switch (href) {
      case "#home":
        return dict.nav.home;
      case "#about":
        return dict.nav.about;
      case "#service":
        return dict.nav.project;
      case "#experience":
        return dict.nav.experience;
      case "#blog":
        return dict.nav.blog;
      case "#contact":
        return dict.nav.contact;
      default:
        return fallback;
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSticky
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5 lg:py-6 border-b border-white/10"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={`/${currentLang}`}
          className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${
            isSticky
              ? "text-[#2e3d48] dark:text-white"
              : "text-white"
          }`}
        >
          {brand}
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-cyan-500 ${
                isSticky
                  ? activeHash === link.href
                    ? "text-cyan-600 dark:text-cyan-400 font-bold"
                    : "text-zinc-600 dark:text-zinc-300"
                  : activeHash === link.href
                  ? "text-white font-bold underline decoration-2 underline-offset-4 decoration-cyan-400"
                  : "text-white/80"
              }`}
            >
              {getLinkLabel(link.href, link.label)}
            </a>
          ))}


          {/* Theme Toggle */}
          <ThemeToggle isSticky={isSticky} />

          {/* Language Switcher */}
          <div className="flex items-center space-x-1 border border-zinc-300/30 rounded-md p-0.5">
            <button
              onClick={() => changeLanguage("id")}
              className={`px-2 py-0.5 text-xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "id"
                  ? "bg-[#2e3d48] text-white shadow-sm"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-2 py-0.5 text-xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "en"
                  ? "bg-[#2e3d48] text-white shadow-sm"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-4 lg:hidden">
          {/* Theme Toggle (Mobile) */}
          <ThemeToggle isSticky={isSticky} className="text-xs" />

          {/* Language Switcher (Mobile) */}
          <div className="flex items-center space-x-1 border border-zinc-300/30 rounded-md p-0.5">
            <button
              onClick={() => changeLanguage("id")}
              className={`px-1.5 py-0.5 text-2xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "id"
                  ? "bg-[#2e3d48] text-white"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400"
                  : "text-white/70"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className={`px-1.5 py-0.5 text-2xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "en"
                  ? "bg-[#2e3d48] text-white"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400"
                  : "text-white/70"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors cursor-pointer ${
              isSticky
                ? "text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle Menu"
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-lg`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-xl py-4 px-6 flex flex-col space-y-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-base font-semibold py-2 transition-colors ${
                activeHash === link.href
                  ? "text-cyan-600 dark:text-cyan-400 border-l-4 border-cyan-500 pl-2"
                  : "text-zinc-700 dark:text-zinc-300 pl-2"
              }`}
            >
              {getLinkLabel(link.href, link.label)}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
