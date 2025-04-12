"use client";
import React, { useState, useEffect } from "react";

export default function TypingText() {
  const text = "dance with us"; // Text to be typed out
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.substring(0, index + 1));
        setIndex(index + 1);
      }, 150); // Adjust the speed (ms per character) as needed

      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <header className="font-bold text-4xl sm:text-6xl md:text-8xl">
        {displayText}
      </header>
    </div>
  );
}
