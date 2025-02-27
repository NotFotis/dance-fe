"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

export default function NewsComponent() {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new?populate=Image`);
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  const nextNews = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
  };

  const prevNews = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextNews,
    onSwipedRight: prevNews,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="relative bg-transparent text-white py-16 flex flex-col items-center overflow-hidden">


      {/* Carousel */}
      <div {...handlers} className="relative max-w-4xl w-full h-[550px] overflow-hidden">
        <AnimatePresence mode="sync">
          {news.length > 0 && (
            <motion.div
              key={news[currentIndex].id}
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -100 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              className="absolute w-full h-full rounded-lg overflow-hidden shadow-xl flex flex-col justify-end items-start p-8 bg-cover bg-center"
              style={{
                backgroundImage: `url(${URL}${news[currentIndex].Image?.formats?.large?.url || news[currentIndex].Image?.url || "/default-news.jpg"})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {news[currentIndex].Title}
                </h3>
                <p className="text-md text-gray-300 max-w-lg">
                  {news[currentIndex].Content[0]?.children[0]?.text.slice(0, 150) + "..."}
                </p>
                <Link
                  href={`/news/${news[currentIndex].documentId}`}
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
                >
                  Read More →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevNews}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition"
      >
        ◀
      </button>
      <button
        onClick={nextNews}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 transition"
      >
        ▶
      </button>

      {/* Dots Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {news.map((_, index) => (
          <motion.span
            key={index}
            className={`h-3 w-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? "bg-blue-500 scale-125" : "bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(index)}
            animate={{ scale: index === currentIndex ? 1.3 : 1, opacity: index === currentIndex ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}