"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/NavBar";
import AudioForm from "@/components/AudioForm";
import ModernContactForm from "@/components/modals/ContactFormModal";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const AboutPage = () => {
  const router = useRouter();
  const t = useTranslations('about');
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <div className="bg-transparent min-h-screen text-white flex flex-col items-center px-6">
      <Navbar />
      <AudioForm />

      <div className="max-w-7xl mx-auto mt-40">
        <h1 className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest">
          {t("aboutUs")}
        </h1>

        {/* Our Story Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("ourStoryTitle")}
          </h2>
          <p className="mb-4">{t("ourStoryDescription")}</p>
        </section>

        {/* Mission & Vision Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("missionVisionTitle")}
          </h2>
          <p className="mb-4">{t("missionDescription")}</p>
          <p>{t("visionDescription")}</p>
        </section>

        {/* The Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("teamTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-bold mb-2">{t("founderName")}</h3>
              <p className="italic mb-1">{t("founderRole")}</p>
              <p>{t("founderBio")}</p>
            </div>
            <div className="p-6 bg-gray-900 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-bold mb-2">{t("coFounderName")}</h3>
              <p className="italic mb-1">{t("coFounderRole")}</p>
              <p>{t("coFounderBio")}</p>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("joinUsTitle")}
          </h2>
          <p className="mb-4">{t("joinUsDescription")}</p>
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
          >
            {t("contactUs")}
          </button>
        </section>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              ref={modalRef}
              onClick={e => e.stopPropagation()}
              className="bg-black rounded-3xl w-full max-w-xl sm:max-w-md md:max-w-xl lg:max-w-2xl p-4 sm:p-2 relative shadow-lg overflow-y-auto max-h-[90vh]"
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
    </div>
  );
};

export default AboutPage;
