"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaDiscord } from "react-icons/fa";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import ModernContactForm from "@/components/modals/ContactFormModal";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/music", label: "Music" },
  { href: "/calendar", label: "Events" },
  { href: "/community", label: "Community" },
  { href: "/advertise", label: "Advertise" },
  { href: "/about", label: "About" },
];

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
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

  return (
    <>
      <footer className="bg-transparent w-full text-white relative z-10">
        {/* Top Separator */}
        <div className="border-t border-gray-600 max-w-screen-2xl mx-auto px-6" />

        {/* Main Content (full width) */}
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Logo */}
            <div className="mb-6 lg:mb-0 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/logo.jpg"
                alt={t("dancetoday Media Logo")}
                width={150}
                height={50}
                className="w-full h-32 object-cover object-contain"
              />
            </div>

            {/* Quick Links & Language */}
            <nav className="flex flex-col items-center mb-6 lg:mb-0">
              <ul className="flex flex-wrap justify-center lg:justify-start space-x-6 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:underline">
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Media & Email */}
            <div className="flex space-x-4">
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                  >
                    <FaDiscord size={24} />
                  </a>

                  <a
                    href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                  >
                    <FaInstagram size={24} />
                  </a>

                   <a
                     href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                   >
                     <FaFacebook size={24} />
                   </a>
            </div>
          </div>
        </div>

        {/* Middle Separator */}
        <div className="border-t border-gray-600 max-w-screen-2xl mx-auto px-6" />

        {/* Bottom Links & Copyright (constrained) */}
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm mb-4 md:mb-0">
              <Link href="/about" className="hover:underline">
                {t("About2")}
              </Link>
              {/* Contact opens modal */}
              <button
                onClick={() => setShowModal(true)}
                className="hover:underline text-sm"
              >
                {t("Contact")}
              </button>
              <Link href="/privacy-policy" className="hover:underline">
                {t("Privacy Policy")}
              </Link>
            </div>
            <div className="text-sm">
              {t("© {year} dancetoday", { year: currentYear })}
            </div>
          </div>
        </div>
      </footer>

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
              onClick={(e) => e.stopPropagation()}
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
                <X size={24} />
              </button>
              <ModernContactForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
