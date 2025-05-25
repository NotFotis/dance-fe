'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/NavBar';
import AudioForm from '@/components/AudioForm';
import Footer from '@/components/Footer';
import { useCommunityPage } from '@/hooks/useCommunityPage';
import parse from 'html-react-parser';
import { FaUserFriends, FaCircle } from 'react-icons/fa';
import CookieBanner from '@/components/CookieBanner';

// Generic rich-text block renderer
function renderBlock(block, idx) {
  const children = Array.isArray(block.children) ? block.children : [];
  switch (block.type) {
    case 'paragraph': {
      const allEmpty = children.every(c => !(c.text || '').trim());
      if (allEmpty) return <br key={idx} />;
      return (
        <p key={idx} className="mb-4 text-center">
          {children.map((c, j) => {
            const content = parse(c.text || '');
            if (c.bold) return <strong key={j}>{content}</strong>;
            if (c.italic) return <em key={j}>{content}</em>;
            if (c.underline) return <u key={j}>{content}</u>;
            return <span key={j}>{content}</span>;
          })}
        </p>
      );
    }
    case 'list': {
      const ListTag = block.format === 'unordered' ? 'ul' : 'ol';
      const className = block.format === 'unordered'
        ? 'list-disc text-center mx-auto'
        : 'list-decimal text-center mx-auto';
      return (
        <ListTag key={idx} className={className}>
          {block.children.map((child, j) => renderBlock(child, `${idx}-${j}`))}
        </ListTag>
      );
    }
    case 'list-item':
    case 'o-list-item': {
      return (
        <li key={idx} className="text-center">
          {children.map((c, j) => parse(c.text || ''))}
        </li>
      );
    }
    case 'heading': {
      return (
        <h2 key={idx} className="text-2xl font-semibold mt-6 text-center">
          {children.map((c, j) => parse(c.text || ''))}
        </h2>
      );
    }
    default:
      return (
        <div key={idx} className="text-center">
          {children.map((c, j) => parse(c.text || ''))}
        </div>
      );
  }
}

// Renders embed HTML blocks and executes scripts
function EmbedRenderer({ blocks }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const html = blocks
      .map(b => Array.isArray(b.children)
        ? b.children.map(c => c.text).join('')
        : '')
      .join('');
    containerRef.current.innerHTML = html;
    const scripts = Array.from(containerRef.current.querySelectorAll('script'));
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.text = oldScript.text;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }, [blocks]);
  return <div ref={containerRef} className="w-full flex justify-center" />;
}

// Fetch and display total and online counts via invite endpoint
function DiscordStats({ inviteUrl }) {
  const t = useTranslations('community');
  const [stats, setStats] = useState({ online: null, total: null });

  useEffect(() => {
    if (!inviteUrl) return;
    const code = inviteUrl.split('/').filter(Boolean).pop();
    fetch(`https://discord.com/api/v9/invites/${code}?with_counts=true`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setStats({
        total: data.approximate_member_count,
        online: data.approximate_presence_count
      }))
      .catch(() => setStats({ online: null, total: null }));
  }, [inviteUrl]);

  return (
    <div className="flex gap-6 justify-center">
      <div className="bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg w-40 h-40 flex flex-col items-center justify-center">
        <FaUserFriends size={32} className="mb-2 text-purple-400" />
        <span className="text-3xl font-bold text-white">{stats.total ?? '...'}</span>
        <span className="text-gray-400 text-sm mt-1">{t('totalMembers')}</span>
      </div>
      <div className="bg-black bg-opacity-50 p-6 rounded-2xl shadow-lg w-40 h-40 flex flex-col items-center justify-center">
        <FaCircle size={32} className="mb-2 text-green-400" />
        <span className="text-3xl font-bold text-white">{stats.online ?? '...'}</span>
        <span className="text-gray-400 text-sm mt-1">{t('onlineNow')}</span>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const t = useTranslations('community');
    const locale = useLocale();
    const apiLocale = locale === 'el' ? 'el-GR' : locale;
  const { community, isLoading, isError } = useCommunityPage(apiLocale);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { 
            email: email,
            confirmed: true
          }
        })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setMessage(t('subscribeSuccess'));
      setEmail('');
    } catch {
      setMessage(t('subscribeError'));
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-32 text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
    </div>
  );
  if (isError || !community) return (
    <div className="text-center text-red-500 py-32">{t('errorLoading')}</div>
  );

  const {
    discordInviteUrl,
    Mix: mixes = [],
    discussionTopic = [],
    newsletterText = [],
    socialEmbedCode = []
  } = community;

  return (
    <div className="bg-transparent min-h-screen text-white px-6 pt-24 pb-20 text-center">
      <Navbar />
      <AudioForm />

      <div className="max-w-screen-2xl mx-auto px-6 flex flex-col items-center space-y-16 mt-20">
        {/* Hero */}
        <section className="w-full mb-8 text-center">
          <h1 className="text-6xl font-extrabold mb-4 tracking-tight">{t('joinHeadline')}</h1>
          <a
            href={discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-2xl font-semibold transition-transform transform hover:scale-105"
          >
            {t('joinDiscord')}
          </a>
        </section>

        {/* Stats */}
        <section className="w-full text-center">
          <h2 className="text-4xl font-bold mb-6 border-b border-gray-700 pb-3">{t('communityStats')}</h2>
          <DiscordStats inviteUrl={discordInviteUrl} />
        </section>

        {/* Latest Mixes */}
        <section className="w-full text-center">
          <h2 className="text-4xl font-bold mb-6 border-b border-gray-700 pb-3">{t('latestMixes')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mixes.map(mix => (
              <div key={mix.id} className="bg-black bg-opacity-50 rounded-xl shadow-inner p-4">
                <EmbedRenderer blocks={mix.embedCode} />
              </div>
            ))}
          </div>
        </section>

        {/* Discussion Boards */}
        <section className="w-full text-center">
          <h2 className="text-4xl font-bold mb-6 border-b border-gray-700 pb-3">{t('discussionBoards')}</h2>
          <ul className="space-y-4">
            {discussionTopic.map(topic => (
              <li key={topic.id}>
                <a href={topic.link} className="text-purple-400 hover:underline text-2xl font-medium">{topic.title}</a>
              </li>
            ))}
          </ul>
        </section>

        {/* Social Feed */}
        {socialEmbedCode.length > 0 && (
          <section className="w-full text-center">
            <h2 className="text-4xl font-bold mb-6 border-b border-gray-700 pb-3">{t('socialFeed')}</h2>
            <EmbedRenderer blocks={socialEmbedCode} />
          </section>
        )}

        {/* Newsletter */}
        <section className="w-full mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl w-full font-bold mb-6 border-b border-gray-700 pb-3">{t('newsletter')}</h2>
          <div className="max-w-2xl mx-auto">
            {newsletterText.map((block, i) => renderBlock(block,i))}
          </div>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-4 max-w-lg w-full items-center mb-10">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('yourEmail')}
              required
              className="w-full px-6 py-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button type="submit" className="px-8 py-4 bg-purple-600 hover:bg-pink-500 rounded-full text-xl font-semibold transition-shadow hover:shadow-xl">{t('subscribe')}</button>
          </form>
          {message && <p className="text-green-400 mt-4">{message}</p>}
        </section>
      </div>
<CookieBanner />
      <Footer />
    </div>
  );
}