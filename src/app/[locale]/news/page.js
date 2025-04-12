"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";
import { useTranslations } from "next-intl";
import NewsDetailsModal from "@/components/modals/NewsDetailsModal";
import Footer from "@/components/Footer";

export default function NewsListPage() {
  const [news, setNews] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  // For opening the news modal.
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  // For pagination.
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 16;

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

  // Reset page when the selected genre changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white py-12 text-2xl">
        {t("loadingNews")}
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-red-500 py-12 text-2xl">
        {t("noNewsFound")}
      </div>
    );
  }

  // Build genre options with "All" as the default.
  const genreOptions = ["All", ...genres.map((genre) => genre.name)];

  // Filter news articles based on selected genre.
  const filteredNews = news.filter((article) => {
    if (selectedGenre === "All") return true;
    return (
      Array.isArray(article.music_genres) &&
      article.music_genres.some((genre) => genre.name === selectedGenre)
    );
  });

  // Sort filtered articles by date descending (latest first).
  const sortedNews = filteredNews.slice().sort(
    (a, b) => new Date(b.Date) - new Date(a.Date)
  );

  const totalPages = Math.ceil(sortedNews.length / articlesPerPage);
  const indexOfFirst = (currentPage - 1) * articlesPerPage;
  const indexOfLast = indexOfFirst + articlesPerPage;
  const currentArticles = sortedNews.slice(indexOfFirst, indexOfLast);

  // Helper function to extract an image URL from an article.
  const getImageUrl = (article) => {
    if (article.Image) {
      // If the image is an object with a direct URL.
      if (article.Image.url) {
        return `${URL}${article.Image.url}`;
      }
      // If it is an array, try to use the first one.
      if (Array.isArray(article.Image) && article.Image[0]) {
        return `${URL}${
          article.Image[0].formats?.medium?.url || article.Image[0].url
        }`;
      }
    }
    return "";
  };

  const openModal = (documentId) => {
    setSelectedNewsId(documentId);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center px-6">
      <Navbar brandName="dancenews" />
      <div className="max-w-6xl w-full px-6 mt-20">
        <h1 className="text-6xl font-bold mb-8 text-center mt-20">{t("title")}</h1>

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

        {/* Grid of Articles (4 columns on large screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => openModal(article.documentId)}
              className="cursor-pointer bg-black rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {getImageUrl(article) && (
                <div className="w-full h-96">
                  <img
                    src={getImageUrl(article)}
                    alt={article.Title}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
              )}
              {/* Genre information added between image and title */}
              {article.music_genres && article.music_genres.length > 0 && (
                <div className="px-6 pt-4">
                  <p className="text-sm text-gray-300 uppercase tracking-wide">
                    {article.music_genres.map((genre) => genre.name).join(", ")}
                  </p>
                </div>
              )}
              {/* Title and Date placed directly below the image */}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-white">
                  {article.Title}
                </h2>
                <p className="text-gray-400">
                  {new Date(article.Date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-10 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-white text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
          >
            {t("previous")}
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 border border-white text-black rounded transition ${
                  currentPage === pageNumber
                    ? "bg-white text-black"
                    : "hover:bg-white hover:text-black"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-white text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
          >
            {t("next")}
          </button>
        </div>
      </div>

      {/* News Details Modal */}
      {selectedNewsId && (
        <NewsDetailsModal
          documentId={selectedNewsId}
          onClose={() => setSelectedNewsId(null)}
        />
      )}
          <Footer/>
    </div>
  );
}
