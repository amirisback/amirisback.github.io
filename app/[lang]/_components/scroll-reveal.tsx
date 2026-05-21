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
    up: "translate-y-10",
    down: "-translate-y-10",
    left: "translate-x-10",
    right: "-translate-x-10",
    none: "",
  };

  const transformClass = isVisible
    ? "translate-y-0 translate-x-0 opacity-100"
    : `${directionClasses[direction]} opacity-0`;

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${transformClass} ${className}`}
      style={{ transitionDelay: delay }}
      data-testid="scroll-reveal-container"
    >
      {children}
    </div>
  );
}
