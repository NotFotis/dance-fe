"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { useEvents } from "@/hooks/useEvents";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function EventsCarousel() {
    const locale = useLocale();
    const apiLocale = locale === 'el' ? 'el-GR' : locale;
  const t = useTranslations("carousel");
  const URL = process.env.NEXT_PUBLIC_URL;
  const { events: rawEvents = [], isLoading } = useEvents(apiLocale);

  const now = new Date();
  const events = rawEvents
    // Filter: only events with a future date (today included)
    .filter(e => {
      const eventDate = new Date(e.Date);
      // Optionally include events that are today (ignoring time)
      return (
        eventDate.setHours(0,0,0,0) >= now.setHours(0,0,0,0)
      );
    })
    // Sort: ascending (soonest first)
    .sort((a, b) => new Date(a.Date) - new Date(b.Date))
    .slice(0, 10);

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slidePrev = () => sliderRef.current?.swiper.slidePrev();
  const slideNext = () => sliderRef.current?.swiper.slideNext();

  return (
    <div className="relative bg-transparent text-white py-16 mt-20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4 md:mb-0">
            {t("title")}
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
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="mySwiper"
        >
          {isLoading ? (
            <SwiperSlide>
              <div className="w-full text-center text-white text-xl">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
              </div>
            </SwiperSlide>
          ) : (
            events.map((evt) => {
              const imgPath = evt.Image?.[0]?.formats?.medium?.url || evt.Image?.[0]?.url;
              const imgUrl = imgPath ? `${imgPath}` : "";
              return (
                <SwiperSlide key={evt.id}>
                  <Link
                    href={`/events/${evt.slug}`}
                    className="block transition-transform transform hover:scale-95 w-full h-full relative z-0 rounded-2xl overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]"
                    style={{ aspectRatio: "9 / 16" }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={evt.Title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                        <span>{t("noImage")}</span>
                      </div>
                    )}
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
                      <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                        {evt.Title}
                      </h3>
                      <p className="text-white text-sm mt-1 text-center drop-shadow-lg">
                        {new Date(evt.Date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {evt.Time ? ` | ${evt.Time.split(".")[0].slice(0, 5)}` : ""}
                      </p>
                      {evt.tickets && (
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={(e) => {
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