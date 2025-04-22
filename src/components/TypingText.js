"use client";
import React, { useState, useEffect } from "react";

export default function TypingText() {
  const phrases = [
    "all about dance music",
    "dance with us"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

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
      }, 2000); // 2 second pause at end of phrase
    }

    return () => clearTimeout(timeout);
  }, [charIndex, phraseIndex]);

  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <header className="font-bold text-4xl text-white text-center sm:text-6xl md:text-8xl">
        {displayText}
      </header>
    </div>
  );
}