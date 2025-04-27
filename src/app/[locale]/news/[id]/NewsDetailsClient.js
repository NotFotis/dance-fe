'use client';
import React from 'react';
import parse from 'html-react-parser';
import {
  FaRegCalendarAlt,
  FaUser,
  FaTags,
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function NewsDetailsClient({ news }) {
  const t = useTranslations('newsDetails');
  const URL = process.env.NEXT_PUBLIC_URL;

  // Format date consistently (day-month-year)
  const formattedDate = new Date(news.Date).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });

  // Exactly the same rich-text renderer you use for events:
  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    // Paragraphs (with blank → <br/>)
    if (block.type === 'paragraph') {
      const allEmpty = children.every((c) => !(c.text || '').trim());
      if (allEmpty) {
        return <br key={`br-${idx}`} />;
      }
      return (
        <p key={`paragraph-${idx}`}>
          {children.map((c, j) => {
            const content = parse(c.text || '') || '';
            if (c.bold)      return <strong key={`b-${idx}-${j}`}>{content}</strong>;
            if (c.italic)    return <em      key={`i-${idx}-${j}`}>{content}</em>;
            if (c.underline) return <u       key={`u-${idx}-${j}`}>{content}</u>;
            return <span    key={`t-${idx}-${j}`}>{content}</span>;
          })}
        </p>
      );
    }

    // For headings, list-item, o-list-item:
    const childrenSpans = children.map((c, j) => (
      <span key={`${block.type}-${idx}-${j}`}>
        {parse(c.text || '')}
      </span>
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
        return (
          <div key={`default-${idx}`} className="mt-4">
            {childrenSpans}
          </div>
        );
    }
  };

  return (
    <div className="bg-transparent text-white flex flex-col items-center mt-20 mb-20">
      {/* 1. Hero image (16:9 aspect) */}
      <div
        className="w-full max-w-screen-lg overflow-hidden rounded-xl drop-shadow-xl my-8"
        style={{ aspectRatio: '16 / 9' }}
      >
        <img
          src={
            news.Image?.[1]?.formats?.large?.url
              ? `${URL}${news.Image[1].formats.large.url}`
              : `${URL}${news.Image[1]?.url || ''}`
          }
          alt={news.Title}
          className="object-cover w-full h-full"
        />
      </div>

      {/* 2. Divided container */}
      <div className="w-full max-w-screen-md px-4 space-y-12 divide-y divide-gray-700">
        {/* — Title, Date & Author */}
        <div className="text-center pt-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {news.Title}
          </h1>
          <p className="mt-2 text-lg text-gray-300 flex justify-center items-center space-x-6">
            <span className="flex items-center">
              <FaRegCalendarAlt className="mr-2" />
              {formattedDate}
            </span>
            {news.author?.name && (
              <span className="flex items-center">
                <FaUser className="mr-2" />
                {news.author.name}
              </span>
            )}
          </p>
        </div>

        {/* — Genres (if any) */}
        <section className="pt-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            <FaTags className="inline-block mr-2" />
            {t('genres')}
          </h2>
          {news.music_genres?.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              {news.music_genres.map((g) => (
                <span
                  key={g.id}
                  className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">{t('noGenres')}</p>
          )}
        </section>

        {/* — Description (uses same renderBlock as events) */}
        <section className="pt-12 text-left prose prose-lg text-gray-300">
          {Array.isArray(news.description) && news.description.length > 0 ? (
            news.description.map((block, i) => renderBlock(block, i))
          ) : (
            <p>{t('noDescription')}</p>
          )}
        </section>
      </div>
    </div>
  );
}
