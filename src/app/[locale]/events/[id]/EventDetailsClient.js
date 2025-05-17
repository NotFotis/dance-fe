'use client';

import React, { useRef } from 'react';
import parse from 'html-react-parser';
import {
  FaFacebook,
  FaInstagram,
  FaSpotify,
  FaSoundcloud,
  FaTwitter,
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { SiBeatport, SiTidal, SiApplemusic } from 'react-icons/si';
import { useTranslations } from 'next-intl';

export default function EventDetailsClient({ event }) {
  const t = useTranslations();
  const URL = process.env.NEXT_PUBLIC_URL;
  const venueRef = useRef(null);

  if (!event) {
    return (
      <div className="flex items-center justify-center h-64 mt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }

  // Format date/day
  const formattedDate = new Date(event.Date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = event.Time?.split('.')[0];

  // Extract place name from Google Maps URL
  let locationName = event.Location;
  try {
    const urlObj = new URL(event.Location);
    const segments = urlObj.pathname.split('/');
    const placeIdx = segments.indexOf('place');
    if (placeIdx > -1 && segments[placeIdx + 1]) {
      locationName = decodeURIComponent(segments[placeIdx + 1].replace(/\+/g, ' '));
    }
  } catch (e) {
    locationName = event.Location;
  }

  // Scroll to venue section
  const handleLocationClick = () => {
    if (venueRef.current) venueRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Render rich text from Strapi
  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    if (block.type === 'paragraph') {
      const allEmpty = children.every((c) => !(c.text || '').trim());
      if (allEmpty) return <br key={`br-${idx}`} />;
      return (
        <p key={`paragraph-${idx}`} className="text-left">
          {children.map((c, j) => {
            const content = parse(c.text || '') || '';
            if (c.bold) return <strong key={`bold-${idx}-${j}`}>{content}</strong>;
            if (c.italic) return <em key={`italic-${idx}-${j}`}>{content}</em>;
            if (c.underline) return <u key={`underline-${idx}-${j}`}>{content}</u>;
            return <span key={`text-${idx}-${j}`}>{content}</span>;
          })}
        </p>
      );
    }

    if (block.type === 'list') {
      const ListTag = block.format === 'unordered' ? 'ul' : 'ol';
      const listClass =
        block.format === 'unordered'
          ? 'list-disc ml-6 text-left'
          : 'list-decimal ml-6 text-left';
      return (
        <ListTag key={`list-${idx}`} className={listClass}>
          {block.children.map((child, j) => renderBlock(child, `${idx}-${j}`))}
        </ListTag>
      );
    }

    if (block.type === 'list-item' || block.type === 'o-list-item') {
      const className =
        block.type === 'list-item'
          ? 'list-disc ml-6 text-left'
          : 'list-decimal ml-6 text-left';
      return (
        <li key={`${block.type}-${idx}`} className={className}>
          {children.map((c) => parse(c.text || ''))}
        </li>
      );
    }

    if (block.type === 'heading') {
      return (
        <h2 key={`heading-${idx}`} className="text-2xl font-semibold mt-6 text-center">
          {children.map((c) => parse(c.text || ''))}
        </h2>
      );
    }

    return (
      <div key={`default-${idx}`} className="text-left">
        {children.map((c) => parse(c.text || ''))}
      </div>
    );
  };

  return (
    <div className="bg-transparent text-white flex flex-col items-center mt-20 mb-20 px-6">
      {/* Hero Image */}
      <div
        className="w-full max-w-screen-2xl mx-auto overflow-hidden my-8 rounded-2xl shadow-xl"
        style={{ aspectRatio: '2 / 1' }}
      >
        <img
          src={
            event.Image?.[1]?.formats?.large?.url
              ? `${event.Image[1].formats.large.url}`
              : `${event.Image[1]?.url || ''}`
          }
          alt={event.Title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="w-full max-w-screen-2xl mx-auto bg-black bg-opacity-50 rounded-2xl shadow-xl divide-y divide-gray-700">
        {/* Title / Date / Location / Tickets */}
        <div className="p-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{event.Title}</h1>
          <p className="mt-4 text-lg text-gray-300 flex flex-wrap justify-center items-center space-x-4">
            <span className="flex items-center">
              <FaRegCalendarAlt className="mr-2" />
              {formattedDate}
            </span>
            {time && (
              <span className="flex items-center">
                <FaRegClock className="mr-2" />
                {time}
              </span>
            )}
            {event.Location && (
              <span className="flex items-center cursor-pointer" onClick={handleLocationClick}>
                <FaMapMarkerAlt className="mr-2" />
                {locationName}
              </span>
            )}
          </p>
          {event.music_genres?.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mt-3">
              {event.music_genres.map((g) => (
                <span key={g.id} className="bg-white text-black rounded-full px-3 py-1 text-sm font-medium">
                  {g.name}
                </span>
              ))}
            </div>
          )}
          {event.tickets && (
            <a
              href={event.tickets}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-black text-white hover:bg-white hover:text-black transition px-6 py-3 rounded-xl text-lg font-semibold"
            >
              {t('buyTickets')}
            </a>
          )}
        </div>

        {/* Lineup */}
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('lineup')}</h2>
          {event.artists?.length > 0 ? (
            <ul className="space-y-4 text-center">
              {event.artists.map((artist, idx) => (
                <li key={artist.id || `artist-${idx}`} className="flex flex-col items-center">
                  <div className="flex justify-center space-x-4">
                    <span className="text-xl font-medium mb-1">{artist.Name}</span>
                    {artist.Socials?.map((social, i2) => {
                      let Icon;
                      switch (social.platform.toLowerCase()) {
                        case 'facebook': Icon = FaFacebook; break;
                        case 'instagram': Icon = FaInstagram; break;
                        case 'spotify': Icon = FaSpotify; break;
                        case 'beatport': Icon = SiBeatport; break;
                        case 'soundcloud': Icon = FaSoundcloud; break;
                        case 'x': Icon = FaTwitter; break;
                        case 'tidal': Icon = SiTidal; break;
                        case 'apple music': Icon = SiApplemusic; break;
                        default: Icon = null;
                      }
                      return Icon ? (
                        <a key={i2} href={social.URL} target="_blank" rel="noopener noreferrer">
                          <Icon size={24} />
                        </a>
                      ) : null;
                    })}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">{t('noLineup')}</p>
          )}
        </div>



        {/* Description */}
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('description')}</h2>
          {Array.isArray(event.description) && event.description.length > 0 ? (
            event.description.map((block, i) => renderBlock(block, i))
          ) : (
            <p key="no-description" className="text-center">{t('noDescription')}</p>
          )}
        </div>

        {/* Venue Map */}
        <div ref={venueRef} id="venue" className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('venue')}</h2>
          <div className="w-full h-64 rounded-xl overflow-hidden">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(event.Location)}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Location"
            />
          </div>
        </div>
                {/* Hosts with Images */}
                <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('hosts')}</h2>
          {event.hosts?.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {event.hosts.map((host) => (
                <li key={host.id} className="flex flex-col items-center">
                  {host.image && (
                    <img
                      src={
                        host.image.formats?.medium?.url
                          ? `${host.image.formats.medium.url}`
                          : `${host.image.url}`
                      }
                      alt={host.name}
                      className="w-[80%] h-32 object-cover rounded-2xl mb-4"
                    />
                  )}
                  {/* <span className="text-lg font-medium text-white">{host.name}</span> */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">{t('noHosts')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
