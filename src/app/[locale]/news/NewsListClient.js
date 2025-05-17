'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Seo from '@/components/seo';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AudioForm from '@/components/AudioForm';
import { useTranslations } from 'next-intl';
import { useNews } from '@/hooks/useNews';
import { useGenres } from '@/hooks/useGenres';

export default function NewsListPage() {
  const t = useTranslations('news');
  const URL = process.env.NEXT_PUBLIC_URL;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 3) News + genre + pagination
  const { news = [], loading: newsLoading }     = useNews({ populate: '*' });
  const { genres = [], loading: genresLoading } = useGenres();

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentPage, setCurrentPage]     = useState(1);
  const perPage = 16;

  useEffect(() => setCurrentPage(1), [selectedGenre]);

  const genreOptions = ['All', ...genres.map(g => g.name)];
  const filtered = news.filter(article =>
    selectedGenre === 'All'
      ? true
      : article.music_genres?.some(g => g.name === selectedGenre)
  );
  const sorted = filtered.slice().sort(
    (a, b) => new Date(b.Date) - new Date(a.Date)
  );

  const totalPages = Math.ceil(sorted.length / perPage);
  const pageItems  = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const getImageUrl = article => {
    if (!article.Image) return '';
    const img = Array.isArray(article.Image)
      ? article.Image[0]
      : article.Image;
    if (img.formats?.medium?.url) {
      return `${img.formats.medium.url}`;
    }
    if (img.url) {
      return `${img.url}`;
    }
    return '';
  };

  return (
    <>
      <div className="bg-transparent min-h-screen text-white flex flex-col items-center px-6">
        <Navbar brandName="dancenews" />
        <AudioForm />

        <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20">
        <h1 className="text-6xl font-bold mb-8 text-center mt-20">
            {t('title')}
          </h1>

          {/* Genre Filter */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
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
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading / Empty / Grid */}
          {(newsLoading || genresLoading) ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pageItems.map(article => (
                <Link
                  key={article.id}
                  href={`/news/${article.documentId}`}
                  className="group relative block h-full overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-95"
                  style={{ aspectRatio: '9 / 16' }}
                >
                  {getImageUrl(article) ? (
                    <img
                      src={getImageUrl(article)}
                      alt={article.Title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-700">
                      <span>{t('noImage')}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70">
                    {article.music_genres?.length > 0 && (
                      <p className="mb-2 text-center text-sm uppercase tracking-wide text-gray-300">
                        {article.music_genres.map(g => g.name).join(', ')}
                      </p>
                    )}
                    <h2 className="text-center text-2xl font-bold text-white">
                      {article.Title}
                    </h2>
                    <p className="mt-1 text-center text-sm text-white">
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
                className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
              >
                {t('previous')}
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded border px-4 py-2 transition ${
                    currentPage === i + 1
                      ? 'bg-white text-black'
                      : 'border-white bg-black text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
              >
                {t('next')}
              </button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
