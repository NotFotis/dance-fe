// components/NewsListPage.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/NavBar';
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';
import AudioForm from '@/components/AudioForm';
import { useNews } from '@/hooks/useNews';
import { useGenres } from '@/hooks/useGenres';

export default function NewsListPage() {
  // fetch _all_ news for pagination
  const {
    news,
    loading: newsLoading,
    error: newsError,
  } = useNews({ populate: '*' });
  // fetch genres
  const {
    genres,
    loading: genresLoading,
    error: genresError,
  } = useGenres();

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 16;

  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations('news');

  // reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre]);

  // build filter dropdown
  const genreOptions = ['All', ...genres.map(g => g.name)];

  // filter & sort
  const filtered = news.filter(a => {
    if (selectedGenre === 'All') return true;
    return (
      Array.isArray(a.music_genres) &&
      a.music_genres.some(g => g.name === selectedGenre)
    );
  });
  const sorted = filtered.slice().sort(
    (a, b) => new Date(b.Date) - new Date(a.Date)
  );

  // pagination
  const totalPages = Math.ceil(sorted.length / articlesPerPage);
  const start = (currentPage - 1) * articlesPerPage;
  const pageItems = sorted.slice(start, start + articlesPerPage);

  const getImageUrl = article => {
    if (article.Image) {
      if (article.Image.url) return `${URL}${article.Image.url}`;
      if (Array.isArray(article.Image) && article.Image[0]) {
        return `${URL}${
          article.Image[0].formats?.medium?.url || article.Image[0].url
        }`;
      }
    }
    return '';
  };

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center px-6">
      <Navbar brandName="dancenews" />
      <AudioForm />

      <div className="max-w-6xl w-full px-6 mt-20">
        <h1 className="text-6xl font-bold mb-8 text-center mt-20">
          {t('title')}
        </h1>

        {/* Genre Filter */}
        <div className="flex flex-col md:flex-row md:justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-sm">
              {t('filterGenre')}
            </label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              disabled={genresLoading}
              className="py-2 px-4 bg-black border border-white rounded text-white uppercase tracking-wider"
            >
              {genreOptions.map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        {newsLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
          </div>
        ) : pageItems.length === 0 ? (
          <div className="flex justify-center items-center py-32 text-red-500 text-2xl">
            {t('noNewsFound')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {pageItems.map(article => (
              <Link
                key={article.id}
                href={`/news/${article.documentId}`}
                className="cursor-pointer transition-transform transform hover:scale-95 w-full h-[500px] rounded-xl relative z-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)] overflow-hidden block"
              >
                {getImageUrl(article) ? (
                  <img
                    src={getImageUrl(article)}
                    alt={article.Title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                    <span>{t('noImage')}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70">
                  {article.music_genres?.length > 0 && (
                    <p className="text-sm text-gray-300 uppercase tracking-wide text-center mb-2">
                      {article.music_genres.map(g => g.name).join(', ')}
                    </p>
                  )}
                  <h2
                    className="text-2xl font-bold text-white text-center"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                  >
                    {article.Title}
                  </h2>
                  <p
                    className="text-white text-sm mt-1 text-center"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                  >
                    {new Date(article.Date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!newsLoading && pageItems.length > 0 && (
          <div className="flex justify-center items-center mt-10 space-x-4 mb-10">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-black border border-white text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
            >
              {t('previous')}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border border-white rounded transition ${
                  currentPage === i + 1
                    ? 'bg-white text-black'
                    : 'bg-black text-white hover:bg-white hover:text-black'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-black border border-white text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
