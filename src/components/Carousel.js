import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Instagram } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { useEvents } from "@/hooks/useEvents";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import EventDetailsModal from "@/components/modals/EventDetailsModal";

export default function Navbar({ brandName = "dancetoday", showCarousel = true }) {
  const t = useTranslations();
  const locale = useLocale();
  const URL = process.env.NEXT_PUBLIC_URL;

  const { events = [], isLoading } = useEvents();
  const specialEvents = events.filter(evt => evt.specialEvent);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  // modal state
  const [modalEventId, setModalEventId] = useState(null);

  // refs for the button and drawer
  const buttonRef = useRef(null);
  const drawerRef = useRef(null);

  const toggleMenu = () => setIsOpen(open => !open);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { href: "/", label: t("Home") },
    { href: "/news", label: t("News") },
    { href: "/music", label: t("Music") },
    { href: "/calendar", label: t("Events") },
    { href: "/community", label: t("Community") },
    { href: "/advertise", label: t("Advertise") },
    { href: "/about", label: t("About") },
  ];

  const handleEventClick = (id) => {
    setModalEventId(id);
    setIsOpen(false);
  };

  const closeModal = () => setModalEventId(null);

  return (
    <>
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[80vw] max-w-xl">
        <div className="bg-white text-black rounded-full px-8 py-3 flex items-center justify-between shadow-lg">
          <Link href="/" className="text-2xl font-bold">
            {brandName}
          </Link>
          <button ref={buttonRef} onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-x-0 top-5 mx-auto w-[80vw] max-w-xl z-20 overflow-y-auto bg-white text-black shadow-lg rounded-3xl px-6 py-12 max-h-[calc(100vh-2rem)]"
          >
            <div className="w-full">
              <ul className="p-10 space-y-5">
                {navItems.map(item => (
                  <li key={item.href} className="text-center">
                    <Link href={item.href} onClick={() => setIsOpen(false)} className="block transition-opacity duration-200 opacity-70 hover:opacity-100">
                      <h2 className="text-2xl sm:text-3xl font-bold">{item.label}</h2>
                    </Link>
                  </li>
                ))}
              </ul>

              {showCarousel && !isLoading && specialEvents.length > 0 && (
                <div className="relative my-6">
                  <Swiper
                    onSwiper={swiper => { swiperRef.current = swiper; setActiveIndex(swiper.activeIndex); }}
                    onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
                    spaceBetween={10}
                    slidesPerView={1}
                    className="overflow-visible"
                  >
                    {specialEvents.map((evt, idx) => {
                      const imgPath = evt.Image?.[0]?.formats?.small?.url || evt.Image?.[0]?.url;
                      const src = imgPath ? `${URL}${imgPath}` : null;
                      return (
                        <SwiperSlide key={evt.documentId} className="px-2">
                          <div onClick={() => handleEventClick(evt.documentId)} className="relative block h-32 rounded-lg overflow-hidden shadow-lg cursor-pointer">
                            {src && <img src={src} alt={evt.Title} className="w-full h-full object-cover" />}
                            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-transparent to-transparent p-2 text-center">
                              <h3 className="text-white text-lg sm:text-xl font-semibold drop-shadow-lg leading-tight">{evt.Title}</h3>
                              <p className="text-gray-300 text-sm drop-shadow-lg">
                                {new Date(evt.Date).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })}
                              </p>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  <button onClick={() => swiperRef.current.slidePrev()} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => swiperRef.current.slideNext()} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow">
                    <ChevronRight size={16} />
                  </button>

                  <div className="flex justify-center mt-2 space-x-2">
                    {specialEvents.map((_, idx) => (
                      <span key={idx} onClick={() => swiperRef.current.slideTo(idx)} className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-200 ${activeIndex === idx ? "bg-black" : "bg-gray-300"}`} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 border-t border-gray-300 pt-5 px-5 flex flex-col sm:flex-row justify-between items-center">
                <LanguageSwitcher currentLocale={locale} className="mb-4 sm:mb-0" />
                <div className="flex space-x-4 mb-4 sm:mb-0">
                  <a href="https://www.instagram.com/dancetodaygr/" target="_blank" rel="noopener noreferrer" className="transition-opacity duration-200 opacity-70 hover:opacity-100">
                    <Instagram size={24} />
                  </a>
                  <a href="https://discord.gg/6EG7SweXUV" target="_blank" rel="noopener noreferrer" className="transition-opacity duration-200 opacity-70 hover:opacity-100">
                    <FaDiscord size={24} />
                  </a>
                </div>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="inline-block px-4 py-2 rounded-full bg-black text-white text-sm font-medium transition-opacity duration-200 opacity-90 hover:opacity-100">
                  {t("contactUs")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event details modal */}
      {modalEventId && <EventDetailsModal eventId={modalEventId} onClose={closeModal} />}  
    </>
  );
}
