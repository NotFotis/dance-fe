"use client";
import React, { useState, useEffect, useRef } from "react";

// Optional: Use Font Face Observer if you want to wait for the font before rendering anything
  const phrases = [
    "all about dance music",
    "dance with us"
  ];
export default function TypingText() {

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  // Find longest phrase for reserving space
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
      // Pause before moving to next phrase
      timeout = setTimeout(() => {
        setPhraseIndex((phraseIndex + 1) % phrases.length);
        setCharIndex(0);
        setDisplayText("");
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, phraseIndex]);

  return (
    <div className="max-w-screen-2xl flex h-screen items-center justify-center bg-transparent">
      <header
        className="font-bold text-3xl text-white text-center sm:text-6xl md:text-8xl relative w-full"
        style={{
          minHeight: "1em", // fallback if font fails
        }}
      >
        {/* This span reserves full space for the LARGEST PHRASE. Always rendered! */}
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
        {/* Absolutely position the animated text, to not cause shift */}
        <span
          className=" absolute inset-0 flex items-center justify-center w-full"
          style={{ left: 0, top: 0 }}
        >
          {displayText}
        </span>
      </header>
    </div>
  );
}
