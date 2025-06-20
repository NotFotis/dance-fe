'use client';
import React, { useState } from 'react';
import Link from 'next/link';

// If you use a block renderer, import or define it here
function renderBlock(block, idx) {
  const children = Array.isArray(block.children) ? block.children : [];
  switch (block.type) {
    case 'paragraph':
      const allEmpty = children.every(c => !(c.text || '').trim());
      if (allEmpty) return <br key={idx} />;
      return (
        <p key={idx} className="mb-4 text-center">
          {children.map((c, j) => {
            if (c.bold) return <strong key={j}>{c.text}</strong>;
            if (c.italic) return <em key={j}>{c.text}</em>;
            if (c.underline) return <u key={j}>{c.text}</u>;
            return <span key={j}>{c.text}</span>;
          })}
        </p>
      );
    default:
      return (
        <div key={idx} className="text-center">
          {children.map((c, j) => c.text)}
        </div>
      );
  }
}

export default function NewsletterSection({ t, newsletterText }) {
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
          data: { email, confirmed: true }
        })
      });
      if (!res.ok) throw new Error('Subscription failed');
      setMessage(t('subscribeSuccess'));
      setEmail('');
    } catch {
      setMessage(t('subscribeError'));
    }
  };

  return (
    <section className="relative bg-transparent w-full">
      <div className="container mx-auto px-6 py-16">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide text-left mb-2 md:mb-0">
            {t('newsletter')}
          </h2>
          <div className="flex items-center space-x-4">
            <Link
              href="/community"
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              {t('communityTitle')}
            </Link>
          </div>
        </div>
        {/* Card-style content */}
        <div className="w-full  rounded-xl shadow-inner p-8 mx-auto max-w-2xl flex flex-col items-center min-h-[360px]">
          <div className="w-full mb-6">
            {newsletterText.map((block, i) => renderBlock(block, i))}
          </div>
          <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4 max-w-screen-2xl mx-auto items-center">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('yourEmail')}
              required
              className="w-full px-6 py-3 rounded-full bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-black hover:bg-black hover:text-white rounded-full text-xl font-semibold transition-shadow hover:shadow-xl"
            >
              {t('subscribe')}
            </button>
          </form>
          {message && <p className="text-green-400 mt-4">{message}</p>}
        </div>
      </div>
    </section>
  );
}
