"use client";
import React, { useState, useEffect, useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function SpecialEventsBanner() {
  const locale = useLocale();
  const apiLocale = locale === "el" ? "el-GR" : locale;
  const { events = [], isLoading } = useEvents(apiLocale);
  const now = new Date();
  const specialEvents = events.filter(
    evt => evt.specialEvent && evt.Date && new Date(evt.Date) >= now
  );

  const [index, setIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const timeoutRef = useRef(null);
  const router = useRouter();

  // Animation duration constants
  const IMAGE_ANIMATION_DURATION = 0.45;
  const STAGGER_CHILDREN = 0.08;

  useEffect(() => {
    setShowText(false); // reset text reveal on each event
    if (specialEvents.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % specialEvents.length);
    }, 3000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, specialEvents.length]);

  if (isLoading || !specialEvents.length) return null;

  const evt = specialEvents[index];

  // IMAGE: slide in from right, out to right
  const imageVariants = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: IMAGE_ANIMATION_DURATION, ease: "easeInOut" } },
    exit: { x: "-100%", opacity: 0, transition: { duration: IMAGE_ANIMATION_DURATION, delay: STAGGER_CHILDREN * 3, ease: "easeInOut" } }, // leaves after all text is gone
  };

  // Text stagger animation configs
  const textContainer = {
    animate: { transition: { staggerChildren: STAGGER_CHILDREN } },
    exit: { transition: { staggerChildren: STAGGER_CHILDREN * 0.7, staggerDirection: -1 } },
  };
  const textItem = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.38, ease: "easeOut" } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
  };

  return (
    <div className="w-full mx-auto my-4 md:my-6 max-w-screen-2xl px-2 sm:px-8">
      <div
        className="
          relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group cursor-pointer
          bg-black/80 aspect-[16/10] sm:aspect-[16/6] md:aspect-[16/4]
          min-h-[150px] sm:min-h-[180px] md:min-h-[220px]
          flex items-end
        "
        onClick={() => router.push(`/events/${evt.slug}`)}
      >
        {/* IMAGE MOTION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${evt.id}`}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full absolute inset-0"
            style={{ zIndex: 1, borderRadius: "inherit", overflow: "hidden" }}
            onAnimationComplete={(def) => {
              if (def === "animate") setShowText(true);
            }}
          >
            {(evt.Image?.[2] || evt.Image?.[1] || evt.Image?.[0]) ? (
              <img
                src={
                  evt.Image?.[2]?.formats?.large?.url ||
                  evt.Image?.[2]?.formats?.medium?.url ||
                  evt.Image?.[2]?.url ||
                  evt.Image?.[1]?.formats?.large?.url ||
                  evt.Image?.[1]?.formats?.medium?.url ||
                  evt.Image?.[1]?.url ||
                  evt.Image?.[0]?.formats?.large?.url ||
                  evt.Image?.[0]?.formats?.medium?.url ||
                  evt.Image?.[0]?.url
                }
                alt={evt.Title}
                className="w-full h-full object-cover absolute inset-0"
                draggable={false}
              />
            ) : null}
            <div
              className="absolute left-0 right-0 bottom-0 px-3 sm:px-4 pb-6 pt-0 rounded-b-xl sm:rounded-b-2xl flex flex-col justify-end"
              style={{
                height: "60%",
                background: `
                  linear-gradient(
                    to top,
                    rgba(0,0,0,0.70) 65%,
                    rgba(0,0,0,0.38) 85%,
                    transparent 100%
                  )
                `,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* TEXT STAGGERED MOTION */}
        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              key={`txt-${evt.id}`}
              variants={textContainer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="
                absolute bottom-0 left-0 right-0
                p-3 sm:p-6
                z-10 flex flex-col items-start
              "
              style={{ zIndex: 2 }}
            >
              <motion.h3
                className="text-white text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-1 drop-shadow-lg break-words"
                variants={textItem}
              >
                {evt.Title}
              </motion.h3>
              <motion.p
                className="text-gray-100 text-sm sm:text-base mb-2 font-medium drop-shadow break-words"
                variants={textItem}
              >
                {new Date(evt.Date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </motion.p>
              <motion.span
                className="
                  inline-block mt-1 px-3 py-2
                  bg-white/10 text-white text-xs sm:text-sm rounded-full
                  border border-white/20 backdrop-blur
                  break-words
                "
                variants={textItem}
              >
                {evt.Location || "Special Event"}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
