'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function paginate(array, pageSize, pageIndex) {
  const start = pageIndex * pageSize;
  return array.slice(start, start + pageSize);
}

export default function GenreDetailsClient({ genre, artists, events, news }) {
  const t = useTranslations('genreDetails');

  // Pagination state
  const ARTISTS_PER_PAGE = 10;
  const EVENTS_PER_PAGE = 6;
  const NEWS_PER_PAGE = 6;

  const [artistPage, setArtistPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);

  // Paginated arrays
  const pagedArtists = paginate(artists, ARTISTS_PER_PAGE, artistPage - 1);
  const pagedEvents = paginate(events, EVENTS_PER_PAGE, eventPage - 1);
  const pagedNews = paginate(news, NEWS_PER_PAGE, newsPage - 1);

  const totalArtistPages = Math.ceil((artists?.length ?? 0) / ARTISTS_PER_PAGE);
  const totalEventPages = Math.ceil((events?.length ?? 0) / EVENTS_PER_PAGE);
  const totalNewsPages = Math.ceil((news?.length ?? 0) / NEWS_PER_PAGE);

  return (
    <div className="w-full max-w-screen-2xl text-white flex flex-col mt-20 mb-20 px-6">

      {/* ----- PAGE TITLE HERO ----- */}
      <div className="max-w-screen-2xl mt-20 w-full mx-auto flex flex-col items-center  bg-black bg-opacity-50 rounded-2xl shadow-xl p-8 mb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center uppercase drop-shadow-xl">{genre.name}</h1>
        {genre.description && (
          <p className="text-gray-300 max-w-2xl text-center mt-2 text-lg">{genre.description}</p>
        )}
      </div>

      {/* ----- MAIN CARDS CONTAINER ----- */}
      <div className="max-w-screen-2xl w-full flex flex-col items-center bg-black bg-opacity-50 rounded-2xl shadow-xl p-8 mb-8">

        {/* Events Section */}
        <section className="mb-16 w-full max-w-screen-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-700 pb-2">{t('events')}</h2>
          {events?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pagedEvents.map(event => {
                  const img =
                    Array.isArray(event.Image) && event.Image[0]
                      ? event.Image[0]
                      : event.Image;
                  const eventImgUrl =
                    img?.formats?.medium?.url ||
                    img?.formats?.large?.url ||
                    img?.formats?.thumbnail?.url ||
                    img?.url ||
                    null;

                  return (
                    <Link
                      href={`/events/${event.slug}`}
                      key={event.id}
                      className="group rounded-2xl overflow-hidden shadow bg-gray-900 hover:scale-105 transition block max-w-sm mx-auto"
                    >
                      <div className="w-full aspect-[9/16] bg-gray-800 relative">
                        {eventImgUrl ? (
                          <img
                            src={eventImgUrl}
                            alt={event.Title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-800">
                            {event.Title?.[0] ?? "?"}
                          </div>
                        )}
                        {/* Gradient Overlay & Content */}
                        <div
                          className="absolute left-0 right-0 bottom-0 px-4 pb-8 pt-0 rounded-b-2xl flex flex-col justify-end"
                          style={{
                            height: "60%",
                            background: `
                              linear-gradient(
                                to top,
                                rgba(0,0,0,0.60) 65%,
                                rgba(0,0,0,0.35) 85%,
                                transparent 100%
                              )
                            `,
                          }}
                        >
                          <h3 className="font-bold text-2xl mb-1 text-white text-center drop-shadow-lg"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.75)" }}>
                            {event.Title}
                          </h3>
                          <p className="text-white text-sm mb-2 text-center drop-shadow-lg"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.75)" }}>
                            {new Date(event.Date).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {event.music_genres?.map(g => (
                              <span key={g.id} className="bg-white text-black rounded-full px-2 py-0.5 text-xs font-medium">
                                {g.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {/* Pagination for Events */}
              {totalEventPages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-4 mb-10">
                  <button
                    onClick={() => setEventPage(p => p - 1)}
                    disabled={eventPage === 1}
                    className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
                  >
                    {t('previous')}
                  </button>
                  {Array.from({ length: totalEventPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setEventPage(i + 1)}
                      className={`rounded border px-4 py-2 transition ${
                        eventPage === i + 1
                          ? 'bg-white text-black'
                          : 'border-white bg-black text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setEventPage(p => p + 1)}
                    disabled={eventPage === totalEventPages}
                    className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
                  >
                    {t('next')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400">{t('noEvents') || "No events yet."}</p>
          )}
        </section>

        {/* News Section */}
        <section className="mb-16 w-full max-w-screen-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-700 pb-2">{t('news')}</h2>
          {news?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pagedNews.map(item => {
                  const img =
                    Array.isArray(item.Image) && item.Image[0]
                      ? item.Image[0]
                      : item.Image;
                  const newsImgUrl =
                    img?.formats?.medium?.url ||
                    img?.formats?.large?.url ||
                    img?.formats?.thumbnail?.url ||
                    img?.url ||
                    null;

                  return (
                    <Link
                      href={`/news/${item.slug}`}
                      key={item.id}
                      className="group rounded-2xl overflow-hidden shadow bg-gray-900 hover:scale-105 transition block max-w-sm mx-auto"
                    >
                      <div className="w-full aspect-[16/9] bg-gray-800 relative">
                        {newsImgUrl ? (
                          <img
                            src={newsImgUrl}
                            alt={item.Title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-800">
                            {item.Title?.[0] ?? "?"}
                          </div>
                        )}
                        {/* Gradient Overlay & Content */}
                        <div
                          className="absolute left-0 right-0 bottom-0 px-4 pb-8 pt-0 rounded-b-2xl flex flex-col justify-end"
                          style={{
                            height: "60%",
                            background: `
                              linear-gradient(
                                to top,
                                rgba(0,0,0,0.60) 65%,
                                rgba(0,0,0,0.35) 85%,
                                transparent 100%
                              )
                            `,
                          }}
                        >
                          <h3 className="font-bold text-lg mb-1 text-white text-center drop-shadow-lg"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.75)" }}>
                            {item.Title}
                          </h3>
                          <p className="text-white text-sm mb-2 text-center drop-shadow-lg"
                            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.75)" }}>
                            {new Date(item.publishedAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {/* Pagination for News */}
              {totalNewsPages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-4 mb-10">
                  <button
                    onClick={() => setNewsPage(p => p - 1)}
                    disabled={newsPage === 1}
                    className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
                  >
                    {t('previous')}
                  </button>
                  {Array.from({ length: totalNewsPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setNewsPage(i + 1)}
                      className={`rounded border px-4 py-2 transition ${
                        newsPage === i + 1
                          ? 'bg-white text-black'
                          : 'border-white bg-black text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setNewsPage(p => p + 1)}
                    disabled={newsPage === totalNewsPages}
                    className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
                  >
                    {t('next')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400">{t('noNews') || "No news yet."}</p>
          )}
        </section>

        {/* Artists Section */}
        <section className="mt-16 w-full max-w-screen-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-700 pb-2">{t('artists')}</h2>
          {artists?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 justify-items-center">
                {pagedArtists.map(artist => {
                  const artistImg =
                    artist.spotifyImageUrl ||
                    artist.Image?.formats?.large?.url ||
                    artist.Image?.formats?.medium?.url ||
                    artist.Image?.formats?.thumbnail?.url ||
                    artist.Image?.url ||
                    null;
                  return (
                    <Link
                      href={`/artists/${artist.slug}`}
                      key={artist.id}
                      className="flex flex-col items-center group"
                    >
                      <div className="mb-3">
                        {artistImg ? (
                          <img
                            src={artistImg}
                            alt={artist.Name}
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-4xl md:text-5xl font-bold rounded-full bg-gray-800 border-4 border-white shadow-lg">
                            {artist.Name?.[0] ?? "?"}
                          </div>
                        )}
                      </div>
                      <div className="font-semibold text-lg text-center group-hover:text-white transition">{artist.Name}</div>
                    </Link>
                  );
                })}
              </div>
              {/* Pagination for Artists */}
              {totalArtistPages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-4 mb-10">
                  <button
                    onClick={() => setArtistPage(p => p - 1)}
                    disabled={artistPage === 1}
                    className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
                  >
                    {t('previous')}
                  </button>
                  {Array.from({ length: totalArtistPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setArtistPage(i + 1)}
                      className={`rounded border px-4 py-2 transition ${
                        artistPage === i + 1
                          ? 'bg-white text-black'
                          : 'border-white bg-black text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setArtistPage(p => p + 1)}
                    disabled={artistPage === totalArtistPages}
                    className="rounded border border-white bg-black px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition"
                  >
                    {t('next')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-400">{t('noArtists') || "No artists yet."}</p>
          )}
        </section>
      </div>
    </div>
  );
}
