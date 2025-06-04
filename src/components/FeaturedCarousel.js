"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { useEvents } from "@/hooks/useEvents";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
}

export default function FeaturedEventsCarousel() {
  const locale = useLocale();
  const apiLocale = locale === "el" ? "el-GR" : locale;
  const t = useTranslations("carousel");
  const { events: rawEvents = [], isLoading } = useEvents(apiLocale);

  const events = rawEvents
    .filter(e => e.specialEvent)
    .sort((a, b) => new Date(b.Date) - new Date(a.Date))
    .slice(0, 10);

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isMobile = useIsMobile(); // < 768px

  const slidePrev = () => sliderRef.current?.swiper.slidePrev();
  const slideNext = () => sliderRef.current?.swiper.slideNext();

  // Card sizes
  const cardHeight = isMobile ? 400 : 650;
  const cardWidth = isMobile ? 250 : 270;
  const activeWidth = isMobile ? 250 : 600;

  return (
    <div className="relative bg-transparent text-white py-16 mt-20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4 md:mb-0">
            {t("featuredEvents") || "Featured Events"}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={slidePrev}
              className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={slideNext}
              className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              <ChevronRight size={20} />
            </button>
            <Link
              href="/calendar"
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              {t("calendar")}
            </Link>
          </div>
        </div>

        <Swiper
          ref={sliderRef}
          slidesPerView="auto"
          centeredSlides={!isMobile}
          spaceBetween={30}
          onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
          className="mySwiper"
        >
          {isLoading ? (
            <SwiperSlide>
              <div className="w-full text-center text-white text-xl">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
              </div>
            </SwiperSlide>
          ) : (
            events.map((evt, idx) => {
              const isActive = idx === activeIndex && !isMobile;
              const imgUrl =
                evt.Image?.[1]?.formats?.large?.url ||
                evt.Image?.[1]?.url ||
                "";

              return (
                <SwiperSlide
                  key={evt.id}
                  style={{
                    width: isActive ? activeWidth : cardWidth,
                    height: cardHeight,
                    transition:
                      "width 0.4s cubic-bezier(.4,2,.6,1), transform 0.3s, opacity 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={`relative z-0 transition-all duration-300
                    ${isActive
                      ? "scale-105 opacity-100 z-20 shadow-2xl"
                      : "scale-95 opacity-70 z-10 shadow-lg"
                    }
                    rounded-2xl overflow-hidden bg-black
                  `}
                >
                  <Link
                    href={`/events/${evt.slug}`}
                    className={`block w-full h-full relative rounded-2xl overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]`}
                  >
                    {imgUrl ? (
                      isActive ? (
                        // ACTIVE: fill card (2/1 aspect if possible)
                        <div
                        className="w-full max-w-screen-2xl mx-auto overflow-hidden my-8 rounded-2xl shadow-xl"
                          style={{
                            aspectRatio: !isMobile ? "2/1" : "9/16",
                            height: "100%",
                            maxHeight: cardHeight,
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={evt.Title}
                            className="w-full h-full object-cover"
                            style={{
                              objectFit: "cover",
                              borderRadius: "1rem",
                              minHeight: 0,
                              minWidth: 0,
                            }}
                          />
                        </div>
                      ) : (
                        // INACTIVE and all MOBILE: 9/16 crop
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ height: "100%" }}
                        >
                          <div
                            style={{
                              aspectRatio: "9/16",
                              width: "100%",
                              height: "100%",
                              maxHeight: "100%",
                              margin: "0 auto",
                              overflow: "hidden",
                              borderRadius: "1rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={imgUrl}
                              alt={evt.Title}
                              className="w-full h-full object-cover"
                              style={{
                                objectFit: "cover",
                                objectPosition: "center",
                                borderRadius: "1rem",
                              }}
                            />
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="bg-gray-700 w-full h-full flex items-center justify-center" style={isActive ? { aspectRatio: !isMobile ? "2/1" : "9/16", height: "100%", maxHeight: cardHeight } : { height: "100%" }}>
                        <span>{t("noImage")}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-2xl">
                      <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                        {evt.Title}
                      </h3>
                      <p className="text-white text-sm mt-1 text-center drop-shadow-lg">
                        {new Date(evt.Date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                        {evt.Time ? ` | ${evt.Time.split(".")[0]}` : ""}
                      </p>
                      {evt.tickets && (
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              window.open(evt.tickets, "_blank");
                            }}
                            className="py-3 px-6 bg-black border border-white rounded-2xl uppercase text-base font-semibold hover:bg-white hover:text-black transition"
                          >
                            {t("buyTickets")}
                          </button>
                        </div>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })
          )}
        </Swiper>

        {/* Custom Pagination Dots */}
        {!isLoading && (
          <div className="flex justify-center mt-6 space-x-2">
            {events.map((_, idx) => (
              <span
                key={idx}
                onClick={() => sliderRef.current?.swiper.slideTo(idx)}
                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-200 ${
                  idx === activeIndex ? "bg-black" : "bg-gray-300"
                }`}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
