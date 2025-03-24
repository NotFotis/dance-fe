"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function NewsComponent() {
  const [news, setNews] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("newsComponent");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch all related data with populate=*
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
        // Sort news by date descending (newest first) and limit to 6 articles
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

  return (
    <div className="relative bg-transparent text-white py-16 mt-20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 md:mb-0">
            {t("title")}
          </h2>
          <div className="flex items-center space-x-4">
            <Link
              href="/news"
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              {t("allNews")}
            </Link>
          </div>
        </div>

        {/* GRID LAYOUT (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.documentId}`} className="cursor-pointer">
              <motion.div
                className="group bg-black border border-gray-600 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl flex flex-col h-96"
                whileHover={{ scale: 1.02 }}
              >
                {/* Increased Image Container */}
                <div className="relative h-64 overflow-hidden">
                  {item.Image &&
                  (item.Image.formats?.medium?.url || item.Image.url) ? (
                    <img
                      src={`${URL}${
                        item.Image.formats?.medium?.url || item.Image.url
                      }`}
                      alt={item.Title}
                      className="object-cover w-full h-full rounded-t-lg transform transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center rounded-t-lg">
                      <span>{t("noImage")}</span>
                    </div>
                  )}
                </div>

                {/* Text Container */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-3xl font-semibold text-white line-clamp-2">
                    {item.Title}
                  </h3>
                  <p className="text-sm text-white mt-2">
                    {new Date(item.Date).toLocaleDateString()}
                  </p>
                  <p className="text-lg text-white mt-auto">
                    {item.music_genres && item.music_genres.length > 0
                      ? item.music_genres.map((genre) => genre.name).join(", ")
                      : t("noGenre")}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
