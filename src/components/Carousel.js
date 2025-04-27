"use client";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import { useEvents } from "@/hooks/useEvents";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function EventsCarousel() {
  const t = useTranslations("carousel");
  const URL = process.env.NEXT_PUBLIC_URL;

  // Fetch all events via SWR hook
  const { events: rawEvents = [], isLoading } = useEvents();

  // Sort by descending date and take up to 6
  const events = rawEvents
    .sort((a, b) => new Date(b.Date) - new Date(a.Date))
    .slice(0, 6);

  const sliderRef = useRef(null);

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
          className="mySwiper"
        >
          {isLoading ? (
            <SwiperSlide>
              <div className="w-full text-center text-white text-xl">
                {t("loadingEvents")}
              </div>
            </SwiperSlide>
          ) : (
            events.map((evt) => {
              const imgPath = evt.Image?.[0]?.formats?.medium?.url || evt.Image?.[0]?.url;
              const imgUrl = imgPath ? `${URL}${imgPath}` : "";
              return (
                <SwiperSlide key={evt.id}>
                  <Link
                    href={`/events/${evt.documentId}`}
                    className="block transition-transform transform hover:scale-95 w-full h-full relative z-0 rounded-2xl overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]"
                    style={{ aspectRatio: '9 / 16' }}
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-2xl">
                      <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                        {evt.Title}
                      </h3>
                      <p className="text-white text-sm mt-1 text-center drop-shadow-lg">
                        {new Date(evt.Date).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {evt.Time ? ` | ${evt.Time.split(".")[0]}` : ""}
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
      </div>
    </div>
  );
}