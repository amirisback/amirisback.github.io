"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  texts: string[];
  typeSpeed?: number;
  backSpeed?: number;
  delayBetween?: number;
}

export function TypingText({
  texts,
  typeSpeed = 100,
  backSpeed = 50,
  delayBetween = 2000,
}: TypingTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const fullText = texts[currentTextIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.slice(0, -1));
      }, backSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText((prev) => fullText.slice(0, prev.length + 1));
      }, typeSpeed);
    }

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), delayBetween);
    }

    if (isDeleting && currentText === "") {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentTextIndex, texts, typeSpeed, backSpeed, delayBetween]);

  if (!texts || texts.length === 0) return null;

  return (
    <span className="inline-flex items-center" data-testid="typing-container">
      <span className="text-white" data-testid="typing-text">{currentText}</span>
      <span
        className="ml-1 inline-block w-[3px] h-[1.2em] bg-white animate-pulse"
        data-testid="typing-cursor"
        style={{ animationDuration: "1s" }}
      />
    </span>
  );
}
