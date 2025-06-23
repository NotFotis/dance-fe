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

  // Fetch all artists and genres (no genre param!)
  const { artists = [], isLoading: artistsLoading } = useArtists({ apiLocale });
  const { genres = [], isLoading: genresLoading } = useGenres(apiLocale);

  const ALL_GENRE = t('all'); // Add "all": "All genres" in your translations!
  const [selectedGenre, setSelectedGenre] = useState(ALL_GENRE);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 18;

  // Debounce the search input
  const debouncedSetSearch = useMemo(
    () => debounce((val) => setDebouncedSearch(val), 400),
    []
  );

  function handleSearchChange(e) {
    setSearch(e.target.value);
    debouncedSetSearch(e.target.value);
  }

  useEffect(() => setCurrentPage(1), [selectedGenre, debouncedSearch]);

  // Genre select options
  const genreOptions = [ALL_GENRE, ...genres.map(g => g.name)];

  // Filter artists by selected genre (client-side filter)
  const genreFiltered = artists.filter(artist =>
    selectedGenre === ALL_GENRE
      ? true
      : artist.music_genres?.some(g => g.name === selectedGenre)
  );

  // Then filter by search
  const searchFiltered = debouncedSearch
    ? genreFiltered.filter(artist =>
        artist.Name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : genreFiltered;

  // Optional: sort alphabetically by Name
  const sorted = searchFiltered.slice().sort((a, b) =>
    a.Name.localeCompare(b.Name)
  );

  // Pagination
  const totalPages = Math.ceil(sorted.length / perPage);
  const pageItems = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  // Image logic (same as before)
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
      <div className="bg-transparent min-h-screen text-white flex flex-col items-center px-6">
        <Navbar brandName="danceartists" />
        <AudioForm />

        <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20">
          <h1 className="text-6xl font-bold mb-8 text-center mt-20">
            {t('title')}
          </h1>

        {/* Search + Filter Row */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 mt-20">
          {/* Search bar left */}
          <div className="w-full md:w-1/3">
          <label className="mb-2 uppercase tracking-wide text-sm md:text-right">
              {t('search')}
            </label>
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
          <div className="flex flex-col w-full md:w-auto md:items-end">
            <label className="mb-2 uppercase tracking-wide text-sm md:text-right">
              {t('filterGenre')}
            </label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              disabled={genresLoading}
              className="py-2 px-4 bg-black border border-white rounded text-white tracking-wider w-full md:w-auto"
            >
              {genreOptions.map(g => (
                <option key={g} value={g}>{g}</option>
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
              {pageItems.length === 0 ? (
                <div className="col-span-full text-center text-xl text-gray-400">
                  {t('noArtists')}
                </div>
              ) : (
                pageItems.map((artist, idx) => (
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
          {!artistsLoading && pageItems.length > 0 && (
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
