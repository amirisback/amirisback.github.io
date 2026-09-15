"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { setLocaleAction } from "@/lib/i18n-actions";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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
    if (newLang === currentLang || isPending) return;
    startTransition(async () => {
      await setLocaleAction(newLang);
      router.refresh();
    });
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isSticky
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl backdrop-saturate-150 shadow-lg shadow-black/5 dark:shadow-black/20 py-3 border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "bg-transparent py-5 lg:py-6 border-b border-white/10"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className={`text-2xl font-bold tracking-wider transition-all duration-300 ${
            isSticky ? "gradient-text" : "text-white"
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
              className={`relative text-sm font-medium tracking-wide transition-all duration-300 ${
                isSticky
                  ? activeHash === link.href
                    ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white px-4 py-1.5 rounded-full shadow-md shadow-cyan-500/20"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-4 py-1.5 nav-link-underline"
                  : activeHash === link.href
                  ? "text-white font-semibold px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-sm"
                  : "text-white/80 hover:text-white px-4 py-1.5"
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
              disabled={isPending}
              className={`px-2 py-0.5 text-xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "id"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-md shadow-cyan-500/20"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  : "text-white/70 hover:bg-white/10"
              } ${isPending ? "opacity-60 cursor-wait" : ""}`}
            >
              ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              disabled={isPending}
              className={`px-2 py-0.5 text-xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "en"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-md shadow-cyan-500/20"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  : "text-white/70 hover:bg-white/10"
              } ${isPending ? "opacity-60 cursor-wait" : ""}`}
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
              disabled={isPending}
              className={`px-1.5 py-0.5 text-2xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "id"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400"
                  : "text-white/70"
              } ${isPending ? "opacity-60 cursor-wait" : ""}`}
            >
              ID
            </button>
            <button
              onClick={() => changeLanguage("en")}
              disabled={isPending}
              className={`px-1.5 py-0.5 text-2xs rounded font-semibold cursor-pointer transition-all ${
                currentLang === "en"
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white"
                  : isSticky
                  ? "text-zinc-600 dark:text-zinc-400"
                  : "text-white/70"
              } ${isPending ? "opacity-60 cursor-wait" : ""}`}
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl backdrop-saturate-150 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-black/10 dark:shadow-black/30 py-6 px-6 flex flex-col space-y-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-base font-semibold py-2 transition-colors ${
                activeHash === link.href
                  ? "bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-600 dark:text-cyan-400 border-l-4 border-cyan-500 pl-4 rounded-r-xl"
                  : "text-zinc-700 dark:text-zinc-300 pl-4 hover:pl-5 hover:text-cyan-600 dark:hover:text-cyan-400"
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
