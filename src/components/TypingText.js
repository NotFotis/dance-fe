"use client"; // Required for React state in Next.js App Router
import React from "react";
import { useState, useEffect } from "react";

export default function TypingText() {
  const words = ["dancetoday", "dance", "with", "us"];
  const typingSpeed = 100; // Speed of typing (ms)
  const pauseTime = 1000; // Pause after typing before moving to the next word (ms)

  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [index, setIndex] = useState(0);
  let timeout;

  useEffect(() => {
    if (index <= words[currentWordIndex].length) {
      // Typing animation for current word
      timeout = setTimeout(() => {
        setDisplayText(words[currentWordIndex].slice(0, index + 1));
        setIndex(index + 1);
      }, typingSpeed);
    } else {
      // When finished typing, pause and then move to the next word
      timeout = setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIndex(0);
        setDisplayText("");
      }, pauseTime);
    }

    return () => clearTimeout(timeout);
  }, [index, currentWordIndex, words]);

  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <h1 className="text-6xl font-bold text-white">{displayText}</h1>
    </div>
  );
}