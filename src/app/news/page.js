"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";
import Link from "next/link";

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
        console.log("News List API response:", response.data);
        // response.data.data is an array of news articles
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="text-center text-white py-12 text-2xl">
        Loading news...
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center text-red-500 py-12 text-2xl">
        No news articles found.
      </div>
    );
  }

  // Sort articles by date descending (latest first)
  const sortedNews = news
    .slice()
    .sort((a, b) => new Date(b.Date) - new Date(a.Date));
  const featuredArticle = sortedNews[0];
  const otherArticles = sortedNews.slice(1);

  return (
    <div className="bg-gradient min-h-screen text-white flex flex-col items-center">
      <Navbar />
      <div className="max-w-6xl w-full px-6 mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">News</h1>

        {/* Featured Article */}
        <Link href={`/news/${featuredArticle.documentId}`}>
          <div className="cursor-pointer mb-10">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              {featuredArticle.Image && featuredArticle.Image.url && (
                <img
                  src={`${URL}${featuredArticle.Image.url}`}
                  alt={featuredArticle.Title}
                  className="w-full h-[500px] object-cover hover:opacity-90 transition-opacity duration-300"
                />
              )}
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-2 text-black">
                  {featuredArticle.Title}
                </h2>
                <p className="text-gray-400">
                  {new Date(featuredArticle.Date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Other Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherArticles.map((article) => (
            <Link href={`/news/${article.documentId}`} key={article.id}>
              <div className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                {article.Image && article.Image.url && (
                  <img
                    src={`${URL}${article.Image.url}`}
                    alt={article.Title}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-2 text-black">
                    {article.Title}
                  </h2>
                  <p className="text-gray-400">
                    {new Date(article.Date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
