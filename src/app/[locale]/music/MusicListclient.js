'use client';

import React, { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/NavBar';
import AudioForm from '@/components/AudioForm';
import { useMusicApi } from '@/hooks/useMusic';
import Footer from '@/components/Footer';

// Helper to pick the first non-null description
function getDescription(item) {
  if (item.description) return item.description;
  if (Array.isArray(item.localizations)) {
    const loc = item.localizations.find(l => Array.isArray(l.description));
    return loc?.description || null;
  }
  return null;
}

// Simple renderer for block-based rich text
function RichText({ blocks }) {
  if (!Array.isArray(blocks)) return null;
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph') {
          const text = block.children.map(c => c.text).join('');
          return <p key={i} className="text-gray-200 mb-4">{text}</p>;
        }
        return null;
      })}
    </>
  );
}

export default function MusicPage() {
  const t = useTranslations('music');
  const locale = useLocale();
  const apiLocale = locale === 'el' ? 'el-GR' : locale;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  const {
    musicItems,
    genres,
    featuredPlaylists,
    isLoading,
    isError,
  } = useMusicApi(API_URL, apiLocale);

  const [selectedMonth, setSelectedMonth] = useState(t('all'));
  const [selectedGenre, setSelectedGenre] = useState(t('all'));
  const [modalTrack, setModalTrack] = useState(null);

  const months = useMemo(() => [
    t('all'),
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ], [t]);

  const genreOptions = useMemo(() => [
    t('all'),
    ...(genres.map(g => g.name) || [])
  ], [genres, t]);

  const filteredMusic = useMemo(() => (
    (musicItems || []).filter(m => {
      const date = new Date(m.releaseDate);
      const monthName = date.toLocaleString(apiLocale, { month: 'long' });
      const monthMatch = selectedMonth === t('all') || monthName.toLowerCase() === selectedMonth.toLowerCase();
      const genreMatch = selectedGenre === t('all') ||
        (Array.isArray(m.music_genres) && m.music_genres.some(g => g.name === selectedGenre));
      return monthMatch && genreMatch;
    })
  ), [musicItems, selectedMonth, selectedGenre, t, apiLocale]);

  const grouped = useMemo(() => (
    (filteredMusic || []).reduce((acc, m) => {
      const key = new Date(m.releaseDate).toLocaleDateString(apiLocale, { month: 'long', year: 'numeric' });
      acc[key] = acc[key] || [];
      acc[key].push(m);
      return acc;
    }, {})
  ), [filteredMusic, apiLocale]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-32 text-red-500 text-2xl">
        {t('errorLoading')}
      </div>
    );
  }

  const playlists = Array.isArray(featuredPlaylists) ? featuredPlaylists : [];

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col px-6">
      <Navbar brandName="dancereleases" />
      <AudioForm />

      {/* Main content matches footer width */}
      <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20">
        <h1 className="text-6xl font-bold mb-8 text-center mt-20">{t('title')}</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-center text-sm">{t('filterMonth')}</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="py-2 px-4 bg-black border border-white rounded text-white uppercase tracking-wider"
            >
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-center text-sm">{t('filterGenre')}</label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="py-2 px-4 bg-black border border-white rounded text-white uppercase tracking-wider"
            >
              {genreOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {/* Featured Playlists */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b text-center border-gray-700 pb-2">{t('featuredPlaylistsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8 mb-12">
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
                    title={`playlist-${idx}`} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Music Grid */}
        {Object.keys(grouped).length === 0 ? (
          <div className="flex justify-center items-center py-32 text-red-500 text-2xl">
            {t('noMusicFound')}
          </div>
        ) : (
          Object.entries(grouped).map(([dateKey, items]) => (
            <div key={dateKey} className="mb-12">
              <h2 className="text-3xl font-bold mb-4 border-b text-center border-gray-700 pb-2">{dateKey}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map(m => {
                  const img = m.coverArt?.formats?.medium?.url || m.coverArt?.url;
                  return (
                    <div
                      key={m.id}
                      className="relative overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-95 cursor-pointer"
                      onClick={() => setModalTrack(m)}
                    >
                      {img ? (
                        <img src={`${URL}${img}`} alt={m.Title} className="h-56 w-full object-cover" />
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-gray-700">
                          <span>{t('noImage')}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80">
                        <h3 className="text-center text-white text-lg font-bold truncate">{m.Title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Overlay */}
      {modalTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50" onClick={() => setModalTrack(null)}>
          <div className="relative w-11/12 md:w-2/3 lg:w-1/2 bg-black rounded-xl overflow-hidden p-6 flex flex-col md:flex-row gap-6" onClick={e => e.stopPropagation()}>
            {modalTrack.coverArt && (
              <img src={`${URL}${modalTrack.coverArt.formats?.medium?.url || modalTrack.coverArt.url}`} alt={modalTrack.Title} className="w-full md:w-1/3 h-auto object-cover rounded-lg" />
            )}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-4xl font-bold text-white mb-2">{modalTrack.Title}</h3>
                {modalTrack.artists && (<p className="text-gray-400 mb-1">{t('artist')}: {modalTrack.artists.map(a => a.Name).join(', ')}</p>)}
                {modalTrack.releaseDate && (<p className="text-gray-400 mb-1">{new Date(modalTrack.releaseDate).toLocaleDateString(apiLocale)}</p>)}
                {modalTrack.music_genres && (<p className="text-gray-400 mb-4">{modalTrack.music_genres.map(g => g.name).join(', ')}</p>)}
                {getDescription(modalTrack) && <RichText blocks={getDescription(modalTrack)} />}
              </div>
              {modalTrack.listenUrl && (
                <iframe
                  src={modalTrack.listenUrl.replace('https://open.spotify.com/', 'https://open.spotify.com/embed/')}
                  width="100%"
                  height="380"
                  allow="encrypted-media"
                  title="spotify-player"
                  className="rounded-lg"
                />
              )}
            </div>
            <button className="absolute top-4 right-4 text-white text-2xl font-bold" onClick={() => setModalTrack(null)}>×</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
