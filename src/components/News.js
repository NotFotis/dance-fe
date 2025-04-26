"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";

// Import the modal component
import NewsDetailsModal from "./modals/NewsDetailsModal";

export default function NewsCarousel() {
  const [news, setNews] = useState([]);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("newsComponent");
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
        const sortedNews = response.data.data.sort(
          (a, b) => new Date(b.Date) - new Date(a.Date)
        );
        setNews(sortedNews.slice(0, 6));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, [API_URL]);

  const slidePrev = () => {
    if (sliderRef.current?.swiper) sliderRef.current.swiper.slidePrev();
  };
  const slideNext = () => {
    if (sliderRef.current?.swiper) sliderRef.current.swiper.slideNext();
  };

  const openModal = (documentId) => setSelectedNewsId(documentId);
  const closeModal = () => setSelectedNewsId(null);

  return (
    <div className="relative bg-transparent text-white py-16 mt-20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4 md:mb-0">
            {t("title")}
          </h2>
          <div className="flex items-center space-x-4">
            <button onClick={slidePrev} className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition">
              <ChevronLeft size={20} />
            </button>
            <button onClick={slideNext} className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition">
              <ChevronRight size={20} />
            </button>
            <Link href="/news" className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded">
              {t("allNews")}
            </Link>
          </div>
        </div>

        <Swiper
          ref={sliderRef}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 }, 1280: { slidesPerView: 4 } }}
          className="mySwiper"
        >
          {news.length ? (
            news.map((item) => {
              const imageUrl = item.Image?.formats?.medium?.url || item.Image?.url
                ? `${URL}${item.Image.formats?.medium?.url || item.Image.url}`
                : "";
              return (
                <SwiperSlide key={item.id}>
                  {/* Card with bottom-only shadow */}
                  <div
                    onClick={() => openModal(item.documentId)}
                    className="cursor-pointer transition-transform transform hover:scale-95 w-full h-[500px] rounded-xl relative z-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]"
                  >
                    {/* Inner container for clipping */}
                    <div className="rounded-xl overflow-hidden w-full h-full">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.Title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                          <span>{t("noImage")}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-2xl font-bold text-white text-center" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                          {item.Title}
                        </h3>
                        <p className="text-white text-sm mt-1 text-center" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                          {new Date(item.Date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}{item.Time ? ` | ${item.Time.split(".")[0]}` : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })
          ) : (
            <SwiperSlide>
              <div className="w-full text-center text-white text-xl">{t("loadingNews")}</div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {selectedNewsId && <NewsDetailsModal documentId={selectedNewsId} onClose={closeModal} />}
    </div>
  );
}
