"use client";
import React, { useState, useEffect, useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FastAverageColor } from "fast-average-color";

const DURATION = 2000;

function getImageUrl(evt) {
  return (
    evt.Image?.[2]?.formats?.large?.url ||
    evt.Image?.[2]?.formats?.medium?.url ||
    evt.Image?.[2]?.url ||
    evt.Image?.[1]?.formats?.large?.url ||
    evt.Image?.[1]?.formats?.medium?.url ||
    evt.Image?.[1]?.url ||
    evt.Image?.[0]?.formats?.large?.url ||
    evt.Image?.[0]?.formats?.medium?.url ||
    evt.Image?.[0]?.url ||
    ""
  );
}

export default function SpecialEventsBanner() {
  const locale = useLocale();
  const apiLocale = locale === "el" ? "el-GR" : locale;
  const { events = [], isLoading } = useEvents(apiLocale);
  const now = new Date();
  const specialEvents = events.filter(
    evt => evt.specialEvent && evt.Date && new Date(evt.Date) >= now
  );

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [colors, setColors] = useState([]);
  const timeoutRef = useRef(null);
  const router = useRouter();

  // --- Extract main colors for all events ---
  useEffect(() => {
    if (!specialEvents.length) return;
    let isMounted = true;
    const fac = new FastAverageColor();
    Promise.all(
      specialEvents.map(evt => {
        const src = getImageUrl(evt);
        return new Promise((resolve) => {
          if (!src) return resolve("#18181b"); // fallback
          const img = new window.Image();
          img.crossOrigin = "Anonymous";
          img.src = src;
          img.onload = () => {
            try {
              const color = fac.getColor(img).hex;
              resolve(color);
            } catch {
              resolve("#18181b");
            }
          };
          img.onerror = () => resolve("#18181b");
        });
      })
    ).then((result) => {
      if (isMounted) setColors(result);
    });
    return () => { isMounted = false; };
  }, [specialEvents]);

  // --- Carousel logic ---
  useEffect(() => {
    if (specialEvents.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setIndex(i => (i + 1) % specialEvents.length);
    }, DURATION);
    return () => clearTimeout(timeoutRef.current);
  }, [index, specialEvents.length]);

  if (isLoading || !specialEvents.length) return null;

  // Determine the two main colors for the gradient
  const prevIdx = (index - 1 + specialEvents.length) % specialEvents.length;
  const prevColor = colors[prevIdx] || "#18181b";
  const nextColor = colors[index] || "#18181b";

  const evt = specialEvents[index];

  // Card slide variants
  const cardVariants = {
    initial: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 1, zIndex: 2 }),
    animate: { x: 0, opacity: 1, zIndex: 3, transition: { duration: 0.6, ease: [0.55, 0, 0.1, 1] } },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 1, zIndex: 2, transition: { duration: 0.6, ease: [0.55, 0, 0.1, 1] } }),
  };

  // Animate background gradient with motion.div
  return (
    <div
      className="
        w-full max-w-screen-2xl mx-auto
        my-4 md:my-8
        aspect-[16/10] sm:aspect-[16/6] md:aspect-[16/4]
        min-h-[200px] sm:min-h-[300px] md:min-h-[340px]
        relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg
        flex items-stretch justify-center
      "
    >
      {/* Animated gradient bg */}
      <motion.div
        key={prevColor + "-" + nextColor}
        initial={{ opacity: 1 }}
        animate={{
          opacity: 1,
          background: `linear-gradient(120deg, ${prevColor}, ${nextColor})`
        }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1, borderRadius: "inherit" }}
      />
      {/* Card transitions */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={evt.id}
          custom={direction}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center"
          style={{
            borderRadius: "inherit",
            overflow: "hidden",
            background: "transparent",
            zIndex: 2
          }}
        >
          {/* IMAGE */}
          {(evt.Image?.[2] || evt.Image?.[1] || evt.Image?.[0]) && (
            <img
              src={getImageUrl(evt)}
              alt={evt.Title}
              className="w-full h-full object-cover absolute inset-0"
              style={{ borderRadius: "inherit" }}
              draggable={false}
            />
          )}
          {/* Overlay */}
          <div
            className="
              absolute left-0 right-0 bottom-0
              px-4 sm:px-6 pb-8 pt-0
              flex flex-col items-center justify-end
              w-full
            "
            style={{
              height: "60%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.70) 65%, rgba(0,0,0,0.38) 85%, transparent 100%)"
            }}
          >
            <div className="w-full flex flex-col items-center">
              <h3 className="text-white text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg break-words text-center">
                {evt.Title}
              </h3>
              <p className="text-gray-100 text-sm sm:text-base mb-2 font-medium drop-shadow break-words text-center">
                {new Date(evt.Date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <span
                className="
                  inline-block mt-1 px-3 py-2
                  bg-white/10 text-white text-xs sm:text-sm rounded-full
                  border border-white/20 backdrop-blur
                  break-words text-center
                "
              >
                {evt.Location || "Special Event"}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
