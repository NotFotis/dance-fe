'use client';
import React from 'react';
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
import { SiBeatport } from 'react-icons/si';
import { useTranslations } from 'next-intl';

export default function EventDetailsClient({ event }) {
  const t = useTranslations();
  const URL = process.env.NEXT_PUBLIC_URL;

  // Format date/day
  const formattedDate = new Date(event.Date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = event.Time?.split('.')[0];

  // Render rich text from Strapi with styling and keys
  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    if (block.type === 'paragraph') {
      const allEmpty = children.every((c) => !(c.text || '').trim());
      if (allEmpty) {
        return <br key={`br-${idx}`} />;
      }
      return (
        <p key={`paragraph-${idx}`}>{
          children.map((c, j) => {
            const content = parse(c.text || '') || '';
            if (c.bold) return <strong key={`bold-${idx}-${j}`}>{content}</strong>;
            if (c.italic) return <em key={`italic-${idx}-${j}`}>{content}</em>;
            if (c.underline) return <u key={`underline-${idx}-${j}`}>{content}</u>;
            return <span key={`text-${idx}-${j}`}>{content}</span>;
          })
        }</p>
      );
    }

    const childrenSpans = children.map((c, j) => (
      <span key={`${block.type}-${idx}-${j}`}>{parse(c.text || '')}</span>
    ));

    switch (block.type) {
      case 'heading':
        return (
          <h2 key={`heading-${idx}`} className="text-2xl font-semibold mt-6">
            {childrenSpans}
          </h2>
        );
      case 'list-item':
        return (
          <li key={`li-${idx}`} className="list-disc ml-6">
            {childrenSpans}
          </li>
        );
      case 'o-list-item':
        return (
          <li key={`oli-${idx}`} className="list-decimal ml-6">
            {childrenSpans}
          </li>
        );
      default:
        return <div key={`default-${idx}`}>{childrenSpans}</div>;
    }
  };

  return (
    <div className="bg-transparent text-white flex flex-col items-center mt-20 mb-20">
      <div
        className="w-full max-w-screen-lg overflow-hidden my-8 rounded-xl drop-shadow-xl"
        style={{ aspectRatio: '16 / 9' }}
      >
        <img
          src={
            event.Image?.[0]?.formats?.large?.url
              ? `${URL}${event.Image[0].formats.large.url}`
              : `${URL}${event.Image[0]?.url || ''}`
          }
          alt={event.Title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Container with modern divide-y utility for clear separation */}
      <div className="w-full max-w-screen-md px-4 space-y-12 divide-y divide-gray-700">
        {/* Title + Date/Time + Location + Tickets */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {event.Title}
          </h1>
          <p className="mt-2 text-lg text-gray-300 flex justify-center items-center space-x-4">
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
          </p>
          {event.Location && (
            <p className="mt-1 text-lg text-gray-300 flex justify-center items-center">
              <FaMapMarkerAlt className="mr-2" />
              {event.Location}
            </p>
          )}
          {event.tickets && (
            <a
              href={event.tickets}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-black hover:bg-white hover:text-black transition px-6 py-3 rounded-xl text-lg font-semibold"
            >
              {t('buyTickets')}
            </a>
          )}
        </div>

        {/* Lineup Section */}
        <section className="pt-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('lineup')}
          </h2>
          {event.artists?.length > 0 ? (
            <ul className="space-y-4">
              {event.artists.map((artist, idx) => (
                <li
                  key={artist.id || `artist-${idx}`}
                  className="flex flex-col items-center"
                >
                  <span className="text-xl font-medium">{artist.Name}</span>
                  {artist.Socials?.length > 0 && (
                    <div className="mt-2 flex space-x-4">
                      {artist.Socials.map((social, i2) => {
                        let Icon;
                        switch (social.platform.toLowerCase()) {
                          case 'facebook': Icon = FaFacebook; break;
                          case 'instagram': Icon = FaInstagram; break;
                          case 'spotify': Icon = FaSpotify; break;
                          case 'beatport': Icon = SiBeatport; break;
                          case 'soundcloud': Icon = FaSoundcloud; break;
                          case 'x': Icon = FaTwitter; break;
                          default: Icon = null;
                        }
                        return (
                          Icon && (
                            <a
                              key={social.URL || `social-${idx}-${i2}`}
                              href={social.URL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Icon size={24} />
                            </a>
                          )
                        );
                      })}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">{t('noLineup')}</p>
          )}
        </section>

        {/* Description Section */}
        <section className="pt-12 text-left prose prose-lg text-gray-300">
          {Array.isArray(event.description) && event.description.length > 0 ? (
            event.description.map((block, i) => renderBlock(block, i))
          ) : (
            <p key="no-description">{t('noDescription')}</p>
          )}
        </section>
      </div>
    </div>
  );
}
