'use client';

import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import Link from 'next/link';
import Seo from '@/components/seo';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AudioForm from '@/components/AudioForm';
import { useTranslations, useLocale } from 'next-intl';
import { useArtists } from '@/hooks/useArtists';
import { useGenres } from '@/hooks/useGenres';
import CookieBanner from '@/components/CookieBanner';

export default function ArtistsPage() {
  const t = useTranslations('artists');
  const locale = useLocale();
  const apiLocale = locale === 'el' ? 'el-GR' : locale;

  // Genre and search state
  const ALL_GENRE = ''; // Value for "All genres"
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRE);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 18;

  // Fetch genres
  const { genres = [], isLoading: genresLoading } = useGenres(apiLocale);

  // Debounce search input
  const debouncedSetSearch = useMemo(
    () => debounce((val) => setDebouncedSearch(val), 400),
    []
  );
  function handleSearchChange(e) {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  }

  // Reset to page 1 when search or genre changes
  useEffect(() => setCurrentPage(1), [debouncedSearch, selectedGenre]);

  // Fetch artists with server-side filter/pagination
  const { artists, isLoading: artistsLoading, total } = useArtists({
    search: debouncedSearch,
    genre: selectedGenre,
    apiLocale,
    page: currentPage,
    pageSize: perPage,
  });

  // Total pages from API count
  const totalPages = Math.ceil((total || 0) / perPage);

  // Clamp page if filter/search results in fewer pages
useEffect(() => {
  if (!artistsLoading && currentPage > totalPages) {
    setCurrentPage(totalPages || 1);
  }
}, [totalPages, artistsLoading]);


  // Helper for artist image
  const getImageUrl = artist => {
    if (artist.spotifyImageUrl) return artist.spotifyImageUrl;
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
        <Navbar brandName="danceartists" />
        <AudioForm />

        <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20">
          <h1 className="text-6xl font-bold mb-8 text-center mt-20">
            {t('title')}
          </h1>

          {/* Search + Genre Filter Row */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 mt-20">
            {/* Search bar left */}
            <div className="w-full md:w-1/3">

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={t('searchPlaceholder')}
                className="w-full px-4 py-2 rounded-lg border border-white bg-black text-white placeholder-gray-400 outline-none"
                autoFocus
              />
            </div>
            {/* Genre Filter right */}
            <div className="flex justify-center">
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="py-2 px-4 rounded border border-white bg-black text-white"
                disabled={genresLoading}
              >
                <option value="">{t('all')}</option>
                {genres.map(g => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading / Empty / Grid */}
          {(artistsLoading || genresLoading) ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {artists.length === 0 ? (
                <div className="col-span-full text-center text-xl text-gray-400">
                  {t('noArtists')}
                </div>
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
                        className="rounded-full aspect-square w-full max-w-[110px] sm:max-w-[130px] object-cover border-2 border-white group-hover:scale-105 transition"
                        style={{ background: '#222' }}
                      />
                    ) : (
                      <div className="rounded-full aspect-square w-full max-w-[110px] sm:max-w-[130px] flex items-center justify-center bg-gray-700 text-3xl font-bold">
                        {artist.Name?.[0] ?? '?'}
                      </div>
                    )}
                    <span className="mt-4 text-lg font-semibold text-center">{artist.Name}</span>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {!artistsLoading && artists.length > 0 && (
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
        <CookieBanner />
        <Footer />
      </div>
    </>
  );
}
