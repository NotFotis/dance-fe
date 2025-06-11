'use client';

import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce'; // npm install lodash.debounce
import Link from 'next/link';
import Seo from '@/components/seo';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { useArtists } from '@/hooks/useArtists';
import { useTranslations, useLocale } from 'next-intl';

export default function ArtistsPage() {
  const t = useTranslations('artists');
  const locale = useLocale();
  const apiLocale = locale === 'el' ? 'el-GR' : locale;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 16;

  // Debounce search input to limit API calls
  const debouncedSetSearch = useMemo(
    () => debounce((val) => setDebouncedSearch(val), 400),
    []
  );

  function handleSearchChange(e) {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  const { artists, isLoading, total } = useArtists({
    search: debouncedSearch,
    apiLocale,
    page: currentPage,
    pageSize: perPage,
  });

  const totalPages = Math.ceil((total || 0) / perPage);

  const getImageUrl = (artist) => {
    if (!artist.Image) return null;
    const img = artist.Image;
    if (img.formats?.thumbnail?.url) return img.formats.thumbnail.url;
    if (img.url) return img.url;
    return null;
  };

  return (
    <>
      <Seo title={t('title')} />
      <div className="bg-transparent min-h-screen text-white flex flex-col items-center px-6">
        <Navbar brandName="dancenews" />
        <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20">
          <h1 className="text-6xl font-bold mb-8 text-center mt-20">
            {t('title')}
          </h1>
          {/* Search bar */}
          <div className="flex justify-center mb-10">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder={t('searchPlaceholder')}
              className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-white bg-black text-white placeholder-gray-400 outline-none"
              autoFocus
            />
          </div>
          {/* Loading / Empty / Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {artists.length === 0 ? (
                <div className="col-span-full text-center text-xl text-gray-400">{t('noArtists')}</div>
              ) : (
                artists.map((artist, idx) => (
                  <Link
                    key={artist.slug ?? artist.id ?? `artist-${idx}`}
                    href={`/artists/${artist.slug ?? artist.id ?? idx}`}
                    className="flex flex-col items-center group"
                  >
                    {getImageUrl(artist) ? (
                      <img
                        src={getImageUrl(artist)}
                        alt={artist.Name}
                        className="rounded-full w-36 h-36 object-cover border-2 border-white group-hover:scale-105 transition"
                        style={{ background: '#222' }}
                      />
                    ) : (
                      <div className="rounded-full w-36 h-36 flex items-center justify-center bg-gray-700 text-3xl font-bold">
                        {artist.Name?.[0] ?? '?'}
                      </div>
                    )}
                    <span className="mt-4 text-lg font-semibold text-center group-hover:underline">{artist.Name}</span>
                  </Link>
                ))
              )}
            </div>
          )}
          {/* Pagination */}
          {!isLoading && artists.length > 0 && (
            <div className="flex justify-center items-center mt-10 space-x-4 mb-10">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
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
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
              >
                {t('next')}
              </button>
            </div>
          )}
        </div>
        <CookieBanner />
        <Footer />
      </div>
    </>
  );
}
