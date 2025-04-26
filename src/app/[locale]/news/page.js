"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";
import { useTranslations } from "next-intl";
import NewsDetailsModal from "@/components/modals/NewsDetailsModal";
import Footer from "@/components/Footer";
import AudioForm from "@/components/AudioForm";

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 16;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("news");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre]);

  const genreOptions = ["All", ...genres.map((g) => g.name)];

  const filteredNews = news.filter((article) => {
    if (selectedGenre === "All") return true;
    return (
      Array.isArray(article.music_genres) &&
      article.music_genres.some((g) => g.name === selectedGenre)
    );
  });

  const sortedNews = filteredNews
    .slice()
    .sort((a, b) => new Date(b.Date) - new Date(a.Date));

  const totalPages = Math.ceil(sortedNews.length / articlesPerPage);
  const startIdx = (currentPage - 1) * articlesPerPage;
  const currentArticles = sortedNews.slice(startIdx, startIdx + articlesPerPage);

  const getImageUrl = (article) => {
    if (article.Image) {
      if (article.Image.url) {
        return `${URL}${article.Image.url}`;
      }
      if (Array.isArray(article.Image) && article.Image[0]) {
        return `${URL}${
          article.Image[0].formats?.medium?.url || article.Image[0].url
        }`;
      }
    }
    return "";
  };

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center px-6">
      <Navbar brandName="dancenews" />
      <AudioForm />

      <div className="max-w-6xl w-full px-6 mt-20">
        <h1 className="text-6xl font-bold mb-8 text-center mt-20">
          {t("title")}
        </h1>

        {/* Genre Filter */}
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
              {genreOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
          </div>
        ) : currentArticles.length === 0 ? (
          <div className="flex justify-center items-center py-32 text-red-500 text-2xl">
            {t("noNewsFound")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedNewsId(article.documentId)}
                className="cursor-pointer transition-transform transform hover:scale-95 w-full h-[500px] rounded-xl relative z-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]"
              >
                <div className="rounded-xl overflow-hidden w-full h-full bg-black">
                  {getImageUrl(article) ? (
                    <img
                      src={getImageUrl(article)}
                      alt={article.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                      <span>{t("noImage")}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70">
                    {article.music_genres?.length > 0 && (
                      <p className="text-sm text-gray-300 uppercase tracking-wide text-center mb-2">
                        {article.music_genres.map((g) => g.name).join(", ")}
                      </p>
                    )}
                    <h2 className="text-2xl font-bold text-white text-center" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      {article.Title}
                    </h2>
                    <p className="text-white text-sm mt-1 text-center" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                      {new Date(article.Date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && currentArticles.length > 0 && (
          <div className="flex justify-center items-center mt-10 space-x-4 mb-10">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-black border border-white text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
            >
              {t("previous")}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border border-white rounded transition ${
                  currentPage === i + 1
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-white hover:text-black"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-black border border-white text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
            >
              {t("next")}
            </button>
          </div>
        )}
      </div>

      {selectedNewsId && (
        <NewsDetailsModal
          documentId={selectedNewsId}
          onClose={() => setSelectedNewsId(null)}
        />
      )}

      <Footer />
    </div>
  );
}