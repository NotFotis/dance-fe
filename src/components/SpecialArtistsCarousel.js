"use client";
import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight, Info, Globe } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { useLocale, useTranslations } from "next-intl";
import { useArtists } from "@/hooks/useArtists";
import Link from "next/link";
import { FaDiscord, FaFacebook, FaInstagram, FaSoundcloud, FaSpotify, FaTwitter } from "react-icons/fa";
import { SiBeatport, SiTidal, SiApplemusic } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";

// Social icon mapping
const SOCIAL_ICONS = {
  'discord': FaDiscord,
  'facebook': FaFacebook,
  'instagram': FaInstagram,
  'spotify': FaSpotify,
  'beatport': SiBeatport,
  'soundcloud': FaSoundcloud,
  'x': FaTwitter,
  'tidal': SiTidal,
  'apple music': SiApplemusic,
  'website': Globe,
};

function ArtistCard({ artist, isOpen, setOpen }) {
  const socials = artist.Socials || [];
  const goToArtist = () => {
    if (!isOpen && artist.slug) window.location.href = `/artists/${artist.slug}`;
  };

  return (
    <motion.div
    layout
    className={`relative flex flex-col items-center justify-center group cursor-pointer select-none bg-neutral-950 rounded-3xl shadow-2xl border border-white/10 ${isOpen ? "pointer-events-none" : ""}`}
    style={{
        width: "100%",
        minHeight: 400,
        aspectRatio: "9 / 16",
        maxWidth: 410,
        margin: "0 auto",
        overflow: "hidden"
    }}
    onClick={goToArtist}
    tabIndex={0}
    >
      {/* Artist image */}
      <img
        src={
          artist.spotifyImageUrl ||
          artist.Image?.formats?.large?.url ||
          artist.Image?.formats?.medium?.url ||
          artist.Image?.url
        }
        alt={artist.Name}
        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
        style={{
          filter: isOpen ? "blur(6px) brightness(0.7)" : "brightness(0.85)",
          zIndex: 0,
          pointerEvents: "none"
        }}
        draggable={false}
      />
      {/* Subtle gradient overlay (like event carousel) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/5 z-10 pointer-events-none rounded-3xl" />

      {/* Name + Info Icon */}
      {!isOpen && (
        <div
          className="absolute flex items-center justify-between px-6 py-3 z-20 left-6 right-6 bottom-7 rounded-2xl"
          style={{
            background: "rgba(12,12,16,0.78)",
            boxShadow: "0 2px 6px 0 rgba(0,0,0,0.11)"
          }}
        >
          <span className="text-white text-xl font-extrabold" style={{ letterSpacing: "-0.01em", maxWidth: 220 }}>
            {artist.Name}
          </span>
          <button
            className="ml-2 w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 border border-white/15 transition"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={e => {
              e.stopPropagation();
              setOpen(true);
            }}
            tabIndex={0}
          >
            <Info size={22} />
          </button>
        </div>
      )}

      {/* Bio Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="bio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex flex-col z-40 p-7"
            style={{
              borderRadius: "1.5rem",
              background: "rgba(20,20,20,0.83)",
              backdropFilter: "blur(7px)",
              overflow: "hidden",
              pointerEvents: "auto",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top row: Name + Close */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-bold text-2xl truncate" style={{ maxWidth: "75%" }}>
                {artist.Name}
              </span>
              <button
                className="z-30 w-10 h-10 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition pointer-events-auto"
                onClick={e => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                tabIndex={0}
              >
                <Info size={22} />
              </button>
            </div>
            {/* Bio */}
            <div
              className="relative z-10 flex-1 w-full overflow-auto mb-5 hide-scrollbar"
            >
              <p
                className="text-white"
                style={{
                  fontSize: "clamp(1.06rem,1.7vw,1.22rem)",
                  lineHeight: 1.7,
                  wordBreak: "break-word",
                  textShadow: "0 2px 14px #000a",
                  letterSpacing: "-0.012em",
                }}
              >
                {artist.bio || "No bio available."}
              </p>
            </div>
            {/* Socials */}
            {socials?.length > 0 && (
              <div className="flex items-center gap-4 mt-auto justify-center">
                {socials.map(soc => {
                  const Icon = SOCIAL_ICONS[soc.platform?.toLowerCase()] || Globe;
                  return (
                    <a
                      key={soc.url}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 border border-white/30 transition"
                      title={soc.type}
                    >
                      <Icon size={22} className="text-white" />
                    </a>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hide the scrollbar cross-browser */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </motion.div>
  );
}

// Carousel header/controls
export default function SpecialArtistsCarousel() {
  const locale = useLocale();
  const t = useTranslations("artistCarousel");
  const apiLocale = locale === "el" ? "el-GR" : locale;
  const { artists, isLoading } = useArtists({ apiLocale, specialArtist: true });

  const specialArtists = artists.filter(a => a.specialArtist);
  const [openIdx, setOpenIdx] = useState(null);
  const swiperRef = useRef(null);

  if (isLoading || specialArtists.length === 0) return null;

  return (
    <div className="relative bg-transparent text-white py-16 mt-12">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4 md:mb-0">
            {t("artists", { defaultValue: "Artists" })}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              <ChevronRight size={20} />
            </button>
            <Link
              href="/artists"
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              {t("allArtists", { defaultValue: "Artists" })}
            </Link>
          </div>
        </div>
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Navigation]}
          spaceBetween={32}
          slidesPerView={1}
          grabCursor={true}
          pagination={{ clickable: true }}
          navigation={false}
          breakpoints={{
            900: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {specialArtists.map((artist, idx) => (
            <SwiperSlide key={artist.id || idx}>
              <div className="flex items-center justify-center h-full w-full py-4">
                <ArtistCard
                  artist={artist}
                  isOpen={openIdx === idx}
                  setOpen={v => setOpenIdx(v ? idx : null)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
