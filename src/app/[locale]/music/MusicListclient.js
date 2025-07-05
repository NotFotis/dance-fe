'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/NavBar';
import AudioForm from '@/components/AudioForm';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { useMusicApi } from '@/hooks/useMusic';
import { useGenres } from '@/hooks/useGenres';
import Link from 'next/link';

export default function MusicPage() {
  const t = useTranslations('music');
  const locale = useLocale();
  const apiLocale = locale === 'el' ? 'el-GR' : locale;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const { genres, isLoading, isError } = useGenres(API_URL, apiLocale);
  const { featuredPlaylists } = useMusicApi(API_URL, apiLocale);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-500 text-2xl">
        {t('errorLoading')}
      </div>
    );
  }

  const playlists = Array.isArray(featuredPlaylists) ? featuredPlaylists : [];

  return (
    <div className="bg-gradient-to-br from-black via-neutral-900 to-black min-h-screen text-white flex flex-col px-6">
      <Navbar brandName="dancereleases" />
      <AudioForm />
      <div className="max-w-screen-2xl w-full mx-auto px-2 mt-24">
        <h1 className="text-6xl font-bold mb-12 text-center drop-shadow-xl">{ t('title')}</h1>

        {/* Featured Playlists Section */}
        {playlists.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-4 border-b text-center border-gray-700 pb-2">
              {t('featuredPlaylistsTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8 mb-2">
              {playlists.map((url, idx) => {
                const embedUrl = url.startsWith('https://open.spotify.com/playlist/')
                  ? url.replace('https://open.spotify.com/playlist/', 'https://open.spotify.com/embed/playlist/')
                  : url;
                return (
                  <div key={idx} className="w-full h-96">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="100%"
                      allow="encrypted-media"
                      title={`playlist-${idx}`}
                      className="rounded-xl shadow-lg border-none"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}


        {/* Genres Grid Section */}
        <section>
          <h2 className="text-3xl font-bold mb-4 border-b text-center border-gray-700 pb-2">
            {t('allGenres') || t('Genres')}</h2>
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-8
  py-8
">
  {(genres || []).map((genre) => (
    <Link
      key={genre.id || genre.name}
      href={`/music/${genre.slug}`}
      tabIndex={0}
      aria-label={genre.name}
      className="outline-none focus:ring-2 focus:ring-white rounded-3xl"
    >
      <div
        className="
          flex items-center justify-center
          h-40
          rounded-3xl
          bg-white/5
          backdrop-blur-xl
          shadow-lg
          border border-white/10
          text-2xl font-semibold
          uppercase tracking-wide
          hover:bg-white/10 hover:scale-105
          active:scale-95
          transition-all
          cursor-pointer
          select-none
          group
          text-center
        "
      >
        <span className="w-full drop-shadow group-hover:text-neutral-50 group-hover:tracking-widest transition-all text-center">
          {genre.name}
        </span>
      </div>
    </Link>
  ))}
</div>
        </section>
      </div>
      <CookieBanner />
      <Footer />
    </div>
  );
}
