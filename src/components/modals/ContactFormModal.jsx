"use client";
import React, { useState } from "react";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { FaDiscord, FaFacebook, FaInstagram } from "react-icons/fa";

// Schema validation with Zod
const contactSchema = z.object({
  name: z.string().min(2, "nameMin"),
  email: z.string().email("emailInvalid"),
  message: z.string().min(10, "messageMin"),
});

export default function ContactPage() {
  const t = useTranslations("contact");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_URL}/contact-forms`, { data });
      reset();
      setIsSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>{t("pageTitle")}</title>
        <meta name="description" content={t("metaDescription")} />
      </Head>
      <section id="contact" className="py-16 px-8 mt-12 rounded-2xl shadow-xl">
        <motion.h2
          className="text-center text-white text-4xl sm:text-5xl font-extrabold mb-10"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t("heading")}
        </motion.h2>

        <AnimatePresence>
          {!isSent && (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mx-auto px-2 sm:px-6 md:px-10 py-8 md:py-10 rounded-3xl shadow-xl space-y-8"
            >
              {/* Name Field */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`peer w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${errors.name ? 'border-red-400' : ''}`}
                  placeholder=" "
                />
                <label
                  htmlFor="name"
                  className="absolute left-5 text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs"
                >
                  {t("labelName")}
                </label>
                {errors.name && <p className="text-red-400 text-sm mt-1 ml-1">{t(errors.name.message)}</p>}
              </motion.div>

              {/* Email Field */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`peer w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${errors.email ? 'border-red-400' : ''}`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs"
                >
                  {t("labelEmail")}
                </label>
                {errors.email && <p className="text-red-400 text-sm mt-1 ml-1">{t(errors.email.message)}</p>}
              </motion.div>

              {/* Message Field */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <textarea
                  id="message"
                  {...register("message")}
                  rows={7}
                  className={`peer text-black w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none ${errors.message ? 'border-red-400' : ''}`}
                  placeholder=" "
                />
                <label
                  htmlFor="message"
                  className="absolute left-5 text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs"
                >
                  {t("labelMessage")}
                </label>
                {errors.message && <p className="text-red-400 text-sm mt-1 ml-1">{t(errors.message.message)}</p>}
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-white hover:bg-gray-300 text-black font-semibold rounded-xl flex items-center justify-center transition"
              >
                {isSubmitting ? (
                  <motion.svg
                    className="animate-spin h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </motion.svg>
                ) : (
                  t("sendButton")
                )}
              </motion.button>
                            {/* Social Icons */}
                            <div className="flex justify-center gap-6 mt-8">
                  <a
                    href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                  >
                    <FaInstagram size={34} />
                  </a>
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                  >
                    <FaDiscord size={34} />
                  </a>
                  <a
                    href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity duration-200 opacity-70 hover:opacity-100"
                  >
                    <FaFacebook size={34} />
                  </a>
              </div>
            </motion.form>
          )}

          {isSent && (
            <motion.div
              key="success"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-20 w-20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <motion.path
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
              <motion.p
                className="mt-4 text-white text-2xl font-semibold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {t("successMessage")}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
