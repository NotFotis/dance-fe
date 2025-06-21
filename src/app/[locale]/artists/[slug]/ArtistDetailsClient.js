'use client';

import React from 'react';
import { FaDiscord, FaFacebook, FaInstagram, FaSpotify, FaSoundcloud, FaTwitter, FaGlobe } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { SiBeatport, SiTidal, SiApplemusic } from 'react-icons/si';
import { X } from 'lucide-react';

const SOCIAL_ICONS = {
  'discord': FaDiscord,
  'facebook': FaFacebook,
  'instagram': FaInstagram,
  'spotify': FaSpotify,
  'beatport': SiBeatport,
  'soundcloud': FaSoundcloud,
  'x': FaTwitter,
  'tidal': SiTidal,
  'apple music': SiApplemusic,
  'website': FaGlobe,
};

export default function ArtistDetailsClient({ artist, events ,news}) {
  const t = useTranslations('artistDetails');

  // Image logic
  const heroUrl =
    artist.Image?.formats?.large?.url ||
    artist.Image?.formats?.medium?.url ||
    artist.Image?.formats?.thumbnail?.url ||
    artist.Image?.url ||
    null;

  return (
    <div className="w-full max-w-screen-2xl bg-transparent text-white flex flex-col mt-20 mb-20 px-6">
      {/* Hero Image */}
      <div
        className="w-full max-w-screen-2xl mx-auto overflow-hidden my-8 rounded-2xl shadow-xl"
        style={{ aspectRatio: '2 / 1' }}
      >
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={artist.Name}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl font-bold bg-gray-900 rounded-2xl">
            {artist.Name?.[0] || '?'}
          </div>
        )}
      </div>

      <div className="w-full max-w-screen-2xl mx-auto bg-black bg-opacity-50 rounded-2xl shadow-xl divide-y divide-gray-700">
        {/* Name / Genres / Socials */}
        <div className="p-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{artist.Name}</h1>
          {artist.music_genres?.length > 0 ? (
            <div className="flex justify-center flex-wrap gap-2 mt-3">
              {artist.music_genres.map(g => (
                <span
                  key={g.id}
                  className="bg-white text-black rounded-full px-3 py-1 text-sm font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 mt-3">{t('noGenres')}</p>
          )}

          {/* Socials */}
          {artist.Socials && artist.Socials.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              {artist.Socials.map((s) => {
                const platform = (s.platform || '').toLowerCase();
                const Icon = SOCIAL_ICONS[platform] || null;
                return (
                  <a
                    key={s.id}
                    href={s.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform"
                    title={s.platform}
                  >
                    {Icon ? (
                      <Icon size={30} />
                    ) : (
                      <span className="px-2 py-1 bg-gray-800 rounded text-sm">{s.platform}</span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('upcomingEvents')}</h2>
          {events?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => {
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
                        className="absolute left-0 right-0 bottom-0 px-4 pb-6 pt-12 rounded-b-2xl flex flex-col justify-end"
                        style={{
                          background: `
                            linear-gradient(
                              to top,
                              rgba(0,0,0,0.70) 70%,
                              rgba(0,0,0,0.25) 100%,
                              transparent 100%
                            )
                          `,
                        }}
                      >
                        <h3 className="font-bold text-lg mb-1 text-white text-center drop-shadow-lg">
                          {event.Title}
                        </h3>
                        <p className="text-white text-sm mb-2 text-center drop-shadow-lg">
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
          ) : (
            <p className="text-center text-gray-400">{t('noUpcomingEvents')}</p>
          )}
        </div>
        {/* News Section */}
<div className="p-6">
  <h2 className="text-2xl font-bold mb-6 text-center">{t('news')}</h2>
  {news?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map(item => {
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
                className="absolute left-0 right-0 bottom-0 px-4 pb-6 pt-12 rounded-b-2xl flex flex-col justify-end"
                style={{
                  background: `
                    linear-gradient(
                      to top,
                      rgba(0,0,0,0.70) 70%,
                      rgba(0,0,0,0.25) 100%,
                      transparent 100%
                    )
                  `,
                }}
              >
                <h3 className="font-bold text-lg mb-1 text-white text-center drop-shadow-lg">
                  {item.Title}
                </h3>
                <p className="text-white text-sm mb-2 text-center drop-shadow-lg">
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
  ) : (
    <p className="text-center text-gray-400">{t('noNews') || "No news yet."}</p>
  )}
</div>

      </div>
    </div>
  );
}
