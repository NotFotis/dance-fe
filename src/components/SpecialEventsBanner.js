"use client";
import React, { useState, useEffect, useRef } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SpecialEventsBanner() {
  const locale = useLocale();
  const apiLocale = locale === "el" ? "el-GR" : locale;
  const { events = [], isLoading } = useEvents(apiLocale);
  const specialEvents = events.filter(evt => evt.specialEvent);

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const router = useRouter();

  // Auto-advance banner every 4s
  useEffect(() => {
    if (specialEvents.length <= 1) return;
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % specialEvents.length);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [index, specialEvents.length]);

  if (isLoading || !specialEvents.length) return null;

  const evt = specialEvents[index];

  return (
    <div className="w-full mx-auto my-6 px-2">
      <div className="relative rounded-2xl overflow-hidden shadow-lg group bg-black/80">
        {/* Controls */}
        <AnimatePresence mode="wait">
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.60, ease: "easeInOut" }}
            className="flex flex-col sm:flex-row items-center cursor-pointer"
            onClick={() => router.push(`/events/${evt.slug}`)}
          >
            {/* Event Image */}
            {evt.Image?.[0] && (
              <img
                src={evt.Image[0].formats?.medium?.url || evt.Image[0].url}
                alt={evt.Title}
                className="w-full sm:w-56 h-36 sm:h-32 object-cover flex-shrink-0"
                draggable={false}
              />
            )}

            {/* Event Details */}
            <div className="flex-1 text-left px-4 py-3">
              <h3 className="text-white text-xl font-semibold mb-1 drop-shadow">
                {evt.Title}
              </h3>
              <p className="text-gray-300 text-sm mb-1">
                {new Date(evt.Date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <span className="inline-block mt-1 px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20">
                {evt.Location || "Special Event"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
