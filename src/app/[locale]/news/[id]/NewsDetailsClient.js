'use client';
import React from 'react';
import parse from 'html-react-parser';
import {
  FaRegCalendarAlt,
  FaUser,
  FaDiscord,
} from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export default function NewsDetailsClient({ news }) {
  const t = useTranslations('newsDetails');
  const URL = process.env.NEXT_PUBLIC_URL;
  const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL;

  if (!news) {
    return (
      <div className="flex items-center justify-center h-64 mt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }

  const formattedDate = new Date(news.Date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    if (block.type === 'paragraph') {
      const allEmpty = children.every(c => !(c.text || '').trim());
      if (allEmpty) return <br key={`br-${idx}`} />;
      return (
        <p key={`paragraph-${idx}`} className="text-left">
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

    if (block.type === 'list-item') {
      return (
        <li key={`li-${idx}`} className="list-disc ml-6 text-left">
          {children.map((c, j) => parse(c.text || ''))}
        </li>
      );
    }

    if (block.type === 'o-list-item') {
      return (
        <li key={`oli-${idx}`} className="list-decimal ml-6 text-left">
          {children.map((c, j) => parse(c.text || ''))}
        </li>
      );
    }

    if (block.type === 'heading') {
      return (
        <h2 key={`heading-${idx}`} className="text-2xl font-semibold mt-6 text-center">
          {children.map((c, j) => parse(c.text || ''))}
        </h2>
      );
    }

    return (
      <div key={`default-${idx}`} className="text-left">
        {children.map((c, j) => parse(c.text || ''))}
      </div>
    );
  };

  return (
    <div className="bg-transparent text-white flex flex-col items-center mt-20 mb-20">
      {/* Hero Image */}
      <div
        className="w-full max-w-screen-xl overflow-hidden my-8 rounded-2xl shadow-xl"
        style={{ aspectRatio: '2 / 1' }}
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

      <div className="w-full max-w-screen-xl px-2 bg-black bg-opacity-50 rounded-2xl shadow-xl divide-y divide-gray-700">
        {/* Title / Date / Author / Genres */}
        <div className="p-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">{news.Title}</h1>
          <p className="mt-4 text-lg text-gray-300 flex flex-wrap justify-center items-center space-x-4">
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
            <div className="flex justify-center flex-wrap gap-2 mt-3">
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
            <p className="text-gray-400 mt-3">{t('noGenres')}</p>
          )}
        </div>

        {/* Description */}
        <div className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{t('description')}</h2>
          {Array.isArray(news.description) && news.description.length > 0 ? (
            news.description.map((block, i) => renderBlock(block, i))
          ) : (
            <p className="text-center text-gray-400">{t('noDescription')}</p>
          )}
        </div>

        {/* Discussion Prompt */}
        <div className="p-6 text-center">
          <p className="text-gray-200 mb-2">{t('joinDiscussion')}</p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-700"
          >
            <FaDiscord size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
