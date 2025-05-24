'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/NavBar';
import AudioForm from '@/components/AudioForm';
import Footer from '@/components/Footer';
import { useAboutPage } from '@/hooks/useAboutPage';
import parse from 'html-react-parser';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

function RichText({ blocks }) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block, i) => {
    if (block.type === 'paragraph') {
      const text = block.children.map(c => c.text).join('');
      return <p key={i} className="mb-4">{parse(text)}</p>;
    }
    return null;
  });
}

export default function AboutUsPage() {
  const t = useTranslations('about');
      const locale = useLocale();
      const apiLocale = locale === 'el' ? 'el-GR' : locale;
  const { about, isLoading, isError } = useAboutPage(apiLocale);
  const URL = process.env.NEXT_PUBLIC_URL;


  // outside click to close modal

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }
  if (isError || !about) {
    return (
      <div className="text-center text-red-500 py-32">{t('errorLoading')}</div>
    );
  }

  const {
    ourStoryDescription,
    missionDescription,
    visionDescription,
    Members = [],

  } = about;

  const renderBlock = (block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    if (block.type === 'paragraph') {
      const allEmpty = children.every(c => !(c.text || '').trim());
      if (allEmpty) return <br key={`br-${idx}`} />;
      return (<p key={`paragraph-${idx}`}
        className="text-left break-words whitespace-normal"
      >
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
    <div className="bg-transparent min-h-screen text-white px-6 mt-20 mb-20 text-center">
      <Navbar />
      <AudioForm />

      <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20 flex flex-col items-center text-center">
        <h1 className="text-6xl py-16 font-bold text-center">
          {t('aboutUs')}
        </h1>

        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('ourStoryTitle')}
          </h2>
          <RichText blocks={ourStoryDescription} />
        </section>

        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('missionTitle')}
          </h2>
          <RichText blocks={missionDescription} />
        </section>


        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('visionTitle')}
          </h2>
          <RichText blocks={visionDescription} />
        </section>

        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('teamTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Members.map(member => {
              const photo = member.photo;
              const imgPath = photo?.formats?.small?.url ?? photo?.url;
              const imgUrl = imgPath
                ? `${imgPath}`
                : '/default-avatar.png';

              return (
                <div
                  key={member.id}
                  className="
        flex flex-col justify-between h-full       /* 1 */
        text-center p-6 bg-black bg-opacity-50 rounded-lg shadow-xl overflow-hidden
      "
                >
                  {/* Top block: image, name, role, bio */}
                  <div className="flex-1">
                    <img
                      src={imgUrl}
                      alt={member.name}
                      className="mx-auto mb-4 w-32 h-32 object-cover rounded-full"
                    />
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="italic mb-4">{member.role}</p>

                    <div className="text-left break-words whitespace-normal"> {/* 2 */}
                      {Array.isArray(member.bio) && member.bio.length > 0
                        ? member.bio.map((block, i) => renderBlock(block, i))
                        : <p className="text-gray-400">No bio available.</p>
                      }
                    </div>
                  </div>

                  {/* Bottom block: socials */}
                  <div className="flex justify-center space-x-3 mt-6">
                    {member.socials?.map((s, i) => {
                      let Icon;
                      switch (s.platform.toLowerCase()) {
                        case 'facebook': Icon = FaFacebook; break;
                        case 'instagram': Icon = FaInstagram; break;
                        case 'x': Icon = SiX; break;
                        default: return null;
                      }
                      return (
                        <a key={i} href={s.URL} target="_blank" rel="noopener noreferrer">
                          <Icon size={24} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
