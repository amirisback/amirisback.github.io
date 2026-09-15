"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: string; // e.g. "0.1s"
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function ScrollReveal({
  children,
  className = "",
  delay = "0s",
  direction = "up",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    if (isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, [isVisible]);

  const directionClasses = {
    up: "translate-y-10 blur-[2px] scale-[0.97]",
    down: "-translate-y-10 blur-[2px] scale-[0.97]",
    left: "translate-x-10 blur-[2px] scale-[0.97]",
    right: "-translate-x-10 blur-[2px] scale-[0.97]",
    none: "blur-[2px] scale-[0.97]",
  };

  const transformClass = isVisible
    ? "translate-y-0 translate-x-0 opacity-100 blur-0 scale-100"
    : `${directionClasses[direction]} opacity-0`;

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${transformClass} ${className}`}
      style={{ transitionDelay: delay }}
      data-testid="scroll-reveal-container"
    >
      {children}
    </div>
  );
}
