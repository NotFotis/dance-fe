"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FaDiscord, FaInstagram, FaFacebook } from "react-icons/fa";
import ModernContactForm from "./modals/ContactFormModal";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  return (
    <>
      <footer className="bg-transparent text-white py-6 w-full bottom-0 left-0 relative z-10">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>&copy; 2025 dancetoday. All Rights Reserved.</p>

          <div className="flex justify-center space-x-4 mt-4">
            <a
              href="https://discord.gg/NJutNGjpBd"
              className="text-white hover:text-gray-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord size={24} />
            </a>
            <a
              href="https://www.instagram.com/dancetodaygr"
              className="text-white hover:text-gray-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.facebook.com/dancetoday.gr"
              className="text-white hover:text-gray-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook size={24} />
            </a>
          </div>

          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
            >
              Contact Us
            </button>
          </div>

          <p className="mt-4">
            <a href="/privacy-policy" className="text-white hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms-of-service" className="text-white hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              ref={modalRef}
              onClick={e => e.stopPropagation()}
              className="bg-black rounded-3xl w-full max-w-md p-4 relative shadow-lg overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
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
