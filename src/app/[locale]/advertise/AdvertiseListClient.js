'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Navbar from '@/components/NavBar';
import AudioForm from '@/components/AudioForm';
import Footer from '@/components/Footer';
import ModernContactForm from '@/components/modals/ContactFormModal';
import { useAdvertisePage } from '@/hooks/useAdvertisePage';
import parse from 'html-react-parser';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/** 
 * RichText renderer for portable text blocks 
 * (paragraphs, lists, headings, formatting)
 */
function RichText({ blocks }) {
  if (!Array.isArray(blocks)) return null;
  return blocks.map((block, idx) => {
    const children = Array.isArray(block.children) ? block.children : [];

    switch (block.type) {
      case 'paragraph': {
        const allEmpty = children.every(c => !(c.text || '').trim());
        if (allEmpty) return <br key={`br-${idx}`} />;
        return (
          <p key={`p-${idx}`} className="mb-4 text-left">
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

      case 'heading':
        return (
          <h2 key={`h2-${idx}`} className="text-2xl font-semibold mt-6 text-center">
            {children.map((c, j) => parse(c.text || ''))}
          </h2>
        );

      case 'list': {
        const ListTag = block.format === 'unordered' ? 'ul' : 'ol';
        const listClass =
          block.format === 'unordered'
            ? 'list-disc ml-6 text-left'
            : 'list-decimal ml-6 text-left';
        return (
          <ListTag key={`list-${idx}`} className={listClass + ' mb-4'}>
            {block.children.map((item, j) => renderListItem(item, `${idx}-${j}`))}
          </ListTag>
        );
      }

      default:
        return null;
    }
  });
}

function renderListItem(item, key) {
  const children = Array.isArray(item.children) ? item.children : [];
  return (
    <li key={key}>
      {children.map((c, j) => parse(c.text || ''))}
    </li>
  );
}

export default function AdvertisePage() {
  const t = useTranslations('');
      const locale = useLocale();
      const apiLocale = locale === 'el' ? 'el-GR' : locale;
  const { about, isLoading, isError } = useAdvertisePage(apiLocale);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (showModal && modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
      </div>
    );
  }

  if (isError || !about) {
    return (
      <div className="text-center text-red-500 py-32">
        {t('errorLoading') || 'Sorry, something went wrong.'}
      </div>
    );
  }

  const { whyAdvertiseDescription, services } = about;

  return (
    <div className="bg-transparent min-h-screen text-white px-6 mt-20 mb-20 text-center">
      <Navbar />
      <AudioForm />

      <div className="max-w-screen-2xl w-full mx-auto px-6 mt-20 flex flex-col items-center text-center">
        <h1 className="text-6xl py-16 font-bold">
          {t('advertiseWithUs')}
        </h1>

        {/* Why Advertise */}
        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('whyAdvertiseTitle')}
          </h2>
          <RichText blocks={whyAdvertiseDescription} />
        </section>

        {/* Advertising Options */}
        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('advertisingOptionsTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.map(service => {
              const Icon = Icons[service.icon] || (() => null);
              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between h-full text-center p-6 bg-black bg-opacity-50 rounded-lg shadow-xl overflow-hidden"
                >
                  <div>
                    <Icon size={48} className="mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <RichText blocks={service.description} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-screen-2xl w-full mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t('getInTouchTitle')}
          </h2>
          <p className="mb-4">{t('getInTouchDescription')}</p>
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
          >
            {t('contactUs')}
          </button>
        </section>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              ref={modalRef}
              onClick={e => e.stopPropagation()}
              className="bg-black rounded-3xl w-full max-w-xl p-6 overflow-y-auto max-h-[90vh] relative shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-6 right-6 text-white hover:text-gray-300"
                onClick={() => setShowModal(false)}
              >
                <Icons.X size={24} />
              </button>
              <ModernContactForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
