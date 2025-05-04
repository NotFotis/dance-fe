// components/NewsCarousel.jsx
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import { useNews } from '@/hooks/useNews';

export default function NewsCarousel() {
  const { news, loading, error } = useNews({ limit: 10 });
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations('newsComponent');
  const sliderRef = useRef(null);

  const slidePrev = () => sliderRef.current?.swiper.slidePrev();
  const slideNext = () => sliderRef.current?.swiper.slideNext();

  return (
    <div className="relative bg-transparent text-white py-16 mt-20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4 md:mb-0">
            {t('title')}
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
              href="/news"
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              {t('allNews')}
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
          {loading ? (
            <SwiperSlide>
              <div className="w-full text-center text-white text-xl">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
              </div>
            </SwiperSlide>
          ) : (
            news.map((item) => {
              const imageUrl =
                item.Image?.[0]?.formats?.medium?.url ||
                item.Image?.[0]?.url
                  ? `${URL}${item.Image[0].formats?.medium?.url || item.Image[0].url}`
                  : '';

              return (
                <SwiperSlide key={item.id}>
                  <Link
                    href={`/news/${item.documentId}`}
                    className="block w-full h-full cursor-pointer"
                  >
                    <div className="transition-transform transform hover:scale-95 w-full h-full rounded-xl relative z-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]">
                      <div
                        className="rounded-xl overflow-hidden w-full h-full"
                        style={{ aspectRatio: '9 / 16' }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.Title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                            <span>{t('noImage')}</span>
                          </div>
                        )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent rounded-b-2xl">
                    <h3 className="text-2xl font-bold text-white text-center drop-shadow-lg">
                            {item.Title}
                          </h3>
                          <p className="text-white text-sm mt-1 text-center drop-shadow-lg">
                            {new Date(item.Date).toLocaleDateString(undefined, {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {item.Time ? ` | ${item.Time.split('.')[0]}` : ''}
                          </p>
                        </div>
                      </div>
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
