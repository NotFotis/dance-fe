"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("news");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
        console.log("News List API response:", response.data);
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}/Music-Genres`);
        setGenres(response.data.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchNews();
    fetchGenres();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="text-center text-white py-12 text-2xl">
        {t("loadingNews")}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center text-red-500 py-12 text-2xl">
        {t("noNewsFound")}
      </div>
    );
  }

  // Create genre options array with "All" as the default option.
  const genreOptions = ["All", ...genres.map((genre) => genre.name)];

  // Filter news articles based on selected genre.
  const filteredNews = news.filter((article) => {
    if (selectedGenre === "All") return true;
    return (
      Array.isArray(article.music_genres) &&
      article.music_genres.some((genre) => genre.name === selectedGenre)
    );
  });

  // Sort filtered articles by date descending (latest first)
  const sortedNews = filteredNews
    .slice()
    .sort((a, b) => new Date(b.Date) - new Date(a.Date));

  const featuredArticle = sortedNews[0];
  const otherArticles = sortedNews.slice(1);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center px-6">
      <Navbar brandName="dancenews" />
      <div className="max-w-6xl w-full px-6 mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center mt-20">
          {t("title")}
        </h1>

        {/* Genre Filter Controls */}
        <div className="flex flex-col md:flex-row md:justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-sm">
              {t("filterGenre")}
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="py-2 px-4 bg-black border border-white rounded text-white uppercase tracking-wider"
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <Link href={`/news/${featuredArticle.documentId}`}>
            <div className="cursor-pointer mb-10 px-6">
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
        )}

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
