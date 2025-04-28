'use client';
import React from 'react';
import parse from 'html-react-parser';
import {
  FaRegCalendarAlt,
  FaUser,
  FaTags,
  FaDiscord,
  FaSpinner,
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function NewsDetailsClient({ news }) {
  const t = useTranslations('newsDetails');
  const URL = process.env.NEXT_PUBLIC_URL;
  const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL;

  // Show loading spinner while news data is not yet available
  if (!news) {
    return (
      <div className="flex items-center justify-center h-64 mt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
        </div>
    );
  }

  // Format date/day
  const formattedDate = new Date(news.Date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Rich-text renderer
  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    if (block.type === 'paragraph') {
      const allEmpty = children.every(c => !(c.text || '').trim());
      if (allEmpty) return <br key={`br-${idx}`} />;
      return (
        <p key={`paragraph-${idx}`}>          
          {children.map((c, j) => {
            const content = parse(c.text || '') || '';
            if (c.bold) return <strong key={`b-${idx}-${j}`}>{content}</strong>;
            if (c.italic) return <em key={`i-${idx}-${j}`}>{content}</em>;
            if (c.underline) return <u key={`u-${idx}-${j}`}>{content}</u>;
            return <span key={`t-${idx}-${j}`}>{content}</span>;
          })}
        </p>
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
      {/* Hero Image */}
      <div
        className="w-full max-w-screen-xl overflow-hidden my-8 rounded-2xl shadow-xl"
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

      <div className="w-full max-w-screen-xl px-2 space-y-8">
        {/* Title / Date / Author */}
        <div className="text-center bg-black bg-opacity-50 p-6 rounded-2xl shadow-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {news.Title}
          </h1>
          <p className="mt-2 text-lg text-gray-300 flex justify-center items-center space-x-4">
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
          {news.music_genres?.length > 0 ? (
            <div className="flex justify-center flex-wrap gap-2 mb-3 mt-3">
              {news.music_genres.map(g => (
                <span
                  key={g.id}
                  className="bg-white text-black rounded-full px-3 py-1 text-sm font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">{t('noGenres')}</p>
          )}
        </div>

        {/* Description */}
        <section className="text-center bg-black bg-opacity-50 p-6 rounded-2xl shadow-xl">
          {Array.isArray(news.description) && news.description.length > 0 ? (
            news.description.map((block, i) => renderBlock(block, i))
          ) : (
            <p className="text-gray-400">{t('noDescription')}</p>
          )}
        </section>

        {/* Discussion Prompt */}
        <section className="text-center bg-black bg-opacity-50 p-6 rounded-2xl shadow-xl">
        <div className="">
            <p className="text-gray-200 mb-2">{t("joinDiscussion")}</p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2  rounded-full hover:bg-blue-700 inline-flex items-center justify-center"
            >
              <FaDiscord size={24} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
