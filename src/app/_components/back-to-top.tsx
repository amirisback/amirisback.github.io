"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-75 pointer-events-none"
      }`}
      style={{
        background: 'linear-gradient(135deg, var(--accent-from), var(--accent-via), var(--accent-to))',
      }}
      aria-label="Back to Top"
      data-testid="back-to-top"
    >
      <i className="fa fa-chevron-up" />
    </button>
  );
}
