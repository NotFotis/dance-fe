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
import { SiBeatport } from 'react-icons/si';
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
    venueRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Improved renderBlock to wrap list items in proper lists
  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];
    if (block.type === 'paragraph') {
      const allEmpty = children.every(c => !(c.text || '').trim());
      if (allEmpty) return <br key={`br-${idx}`} />;
      return (
        <p key={`paragraph-${idx}`} className="mb-4">
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

    const childrenContent = children.map((c, j) => parse(c.text || '') || '');
    switch (block.type) {
      case 'heading':
        return (
          <h2 key={`heading-${idx}`} className="text-2xl font-semibold mt-6 mb-2">
            {childrenContent}
          </h2>
        );
      case 'list-item':
        return (
          <ul key={`ul-${idx}`} className="list-disc ml-6 mb-4">
            <li>{childrenContent}</li>
          </ul>
        );
      case 'o-list-item':
        return (
          <ol key={`ol-${idx}`} className="list-decimal ml-6 mb-4">
            <li>{childrenContent}</li>
          </ol>
        );
      default:
        return <div key={`default-${idx}`}>{childrenContent}</div>;
    }
  };

  return (
    <div className="bg-transparent text-white flex flex-col items-center mt-20 mb-20">
      {/* Hero Image */}
      <div
        className="w-full max-w-screen-xl overflow-hidden my-8 rounded-2xl shadow-xl"
        style={{ aspectRatio: '16 / 9' }}
      >
        <img
          src={
            event.Image?.[1]?.formats?.large?.url
              ? `${URL}${event.Image[1].formats.large.url}`
              : `${URL}${event.Image[1]?.url || ''}`
          }
          alt={event.Title}
          className="object-cover w-full h-full"
        />
      </div>

      <section className="w-full max-w-screen-xl px-2 space-y-6 border border-gray-700 rounded-2xl p-6">
        {/* Title / Date / Location / Tickets */}
        <div className="border-b border-gray-600 pb-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{event.Title}</h1>
          <p className="mt-2 text-lg text-gray-300 flex flex-col md:flex-row justify-center items-center space-x-4">
            <span className="flex items-center mt-2 md:mt-0">
              <FaRegCalendarAlt className="mr-2" />
              {formattedDate}
            </span>
            {time && (
              <span className="flex items-center mt-2 md:mt-0">
                <FaRegClock className="mr-2" />
                {time}
              </span>
            )}
            {event.Location && (
              <span
                className="flex items-center mt-2 md:mt-0 cursor-pointer"
                onClick={handleLocationClick}
              >
                <FaMapMarkerAlt className="mr-2" />
                {locationName}
              </span>
            )}
          </p>
          {event.music_genres?.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mt-4">
              {event.music_genres.map(g => (
                <span
                  key={g.id}
                  className="bg-white text-black rounded-full px-3 py-1 text-sm font-medium"
                >
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
              className="mt-4 inline-block bg-black hover:bg-white hover:text-black transition px-6 py-3 rounded-xl text-lg font-semibold"
            >
              {t('buyTickets')}
            </a>
          )}
        </div>

        {/* Lineup */}
        <div className="border-b border-gray-600 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('lineup')}</h2>
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
                          case 'facebook':
                            Icon = FaFacebook;
                            break;
                          case 'instagram':
                            Icon = FaInstagram;
                            break;
                          case 'spotify':
                            Icon = FaSpotify;
                            break;
                          case 'beatport':
                            Icon = SiBeatport;
                            break;
                          case 'soundcloud':
                            Icon = FaSoundcloud;
                            break;
                          case 'x':
                            Icon = FaTwitter;
                            break;
                          default:
                            Icon = null;
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
        </div>

        {/* Description */}
        <div className="border-b border-gray-600 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('description')}</h2>
          {Array.isArray(event.description) && event.description.length > 0 ? (
            event.description.map((block, i) => renderBlock(block, i))
          ) : (
            <p>{t('noDescription')}</p>
          )}
        </div>

        {/* Venue Map */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('venue')}</h2>
          <div className="w-full h-64 rounded-xl overflow-hidden">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                event.Location
              )}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
