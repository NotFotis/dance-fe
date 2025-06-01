"use client";
import React, { useState, useEffect, useRef } from "react";

export default function TypingText() {
  const phrases = [
    "all about dance music",
    "dance with us"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const longestPhrase = useRef(phrases.reduce((a, b) => a.length > b.length ? a : b));

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout;
    if (charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayText(current.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 150);
    } else {
      timeout = setTimeout(() => {
        setPhraseIndex((phraseIndex + 1) % phrases.length);
        setCharIndex(0);
        setDisplayText("");
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, phraseIndex]);

  return (
    <div className="flex items-center justify-center bg-transparent py-20 sm:py-32 md:py-48 w-full">
      <header
        className="font-bold text-white text-center relative w-full typing-hero-header"
        style={{
          fontSize: "clamp(2rem, 8vw, 6rem)",
          lineHeight: 1.1,
          minHeight: "1em",
        }}
      >
        {/* Reserve space */}
        <span
          aria-hidden="true"
          className="invisible select-none pointer-events-none block"
          style={{
            whiteSpace: "pre",
            visibility: "hidden",
            userSelect: "none",
          }}
        >
          {longestPhrase.current}
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center w-full"
          style={{ left: 0, top: 0 }}
        >
          {displayText}
        </span>
      </header>
      <style jsx global>{`
        @media (max-height: 400px) {
          .typing-hero-header {
            font-size: 1.5rem !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
