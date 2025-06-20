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
    const now = new Date();
    const specialEvents = events.filter(
    evt =>
        evt.specialEvent &&
        evt.Date &&
        new Date(evt.Date) >= now
    );

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
    <div className="w-full mx-auto my-6 max-w-screen-2xl">
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-black/80 aspect-[16/6] sm:aspect-[16/4]"
        onClick={() => router.push(`/events/${evt.slug}`)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {/* Full-width Image */}
                {
                (evt.Image?.[2] || evt.Image?.[1] || evt.Image?.[0])
                    ? (
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
                    )
                    : null
                }


            {/* Overlay */}
                    <div
                      className="absolute left-0 right-0 bottom-0 px-4 pb-8 pt-0 rounded-b-2xl flex flex-col justify-end"
                        style={{
                          height: "60%",
                          background: `
                            linear-gradient(
                              to top,
                              rgba(0,0,0,0.60) 65%,  /* Softer at the bottom */
                              rgba(0,0,0,0.35) 85%,  /* Even softer as it rises */
                              transparent 100%
                            )
                          `,
                        }}
                    >
            {/* Details over image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-1 drop-shadow-lg">
                {evt.Title}
              </h3>
              <p className="text-gray-100 text-base mb-2 font-medium drop-shadow">
                {new Date(evt.Date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <span className="inline-block mt-1 px-4 py-2 bg-white/10 text-white text-sm rounded-full border border-white/20 backdrop-blur">
                {evt.Location || "Special Event"}
              </span>
            </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Optional: Add controls or dots if you want */}
      </div>
    </div>
  );
}
