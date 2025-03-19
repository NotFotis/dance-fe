"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewsComponent() {
  const [news, setNews] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch all related data with populate=*
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
        setNews(response.data.data.slice(0, 6)); // Max rows = 2 (6 articles)
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  // Helper to extract a text summary from dynamic Content
  const getSummary = (contentArray) => {
    if (!Array.isArray(contentArray) || contentArray.length === 0) {
      return "No content available.";
    }
    const richTextBlock = contentArray.find(
      (block) => block.__component === "shared.rich-text" && block.body
    );
    if (richTextBlock) {
      const plainText = richTextBlock.body.replace(/<[^>]+>/g, "");
      return plainText.slice(0, 150) + (plainText.length > 150 ? "..." : "");
    }
    return "No content available.";
  };

  return (
    <div className="bg-transparent text-white py-16">
      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header: Dance News on the left, All News button on the right */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
            Dance News
          </h2>
          <Link
            href="/news"
            className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
          >
            All News
          </Link>
        </div>

        {/* GRID LAYOUT (Responsive) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {news.map((item, index) => {
            // Custom layout for large screens
            let cardClasses =
              "bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300";
            let imgHeight = "h-48"; // Default height for images

            if (index === 0 || index === 5) {
              // First article & last article (large format)
              cardClasses += " lg:col-span-2";
              imgHeight = "h-64";
            }

            return (
              <Link key={item.id} href={`/news/${item.documentId}`} className="cursor-pointer">
                <motion.div className={cardClasses} whileHover={{ scale: 1.02 }}>
                  <div className={`relative ${imgHeight}`}>
                    {item.Image &&
                    (item.Image.formats?.medium?.url || item.Image.url) ? (
                      <img
                        src={`${URL}${
                          item.Image.formats?.medium?.url || item.Image.url
                        }`}
                        alt={item.Title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                        <span>No Image</span>
                      </div>
                    )}
                    {/* Gradient overlay to create a smooth transition */}
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-2xl font-semibold mb-2 text-black">{item.Title}</h3>
                    <p className="text-sm text-black mb-2">
                      {new Date(item.Date).toLocaleDateString()}
                    </p>
                    <p className="text-black mb-4">{getSummary(item.Content)}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
