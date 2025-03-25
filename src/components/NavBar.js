"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";

export default function Navbar({ brandName = "dancetoday" }) {
  const t = useTranslations();
  const locale = useLocale();

  // Use a smaller font size for nav items when locale is Greek
  const navItemSizeClass = locale === 'el' ? 'text-lg font-bold' : 'text-xl font-bold';

  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const isHomepage = segments.length === 1;
  const currentLocale = segments[0] || "en";

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Detect mobile (width < 768px)
  const [isMobile, setIsMobile] = useState(false);
  // New state: detect mobile and tablet screens (width < 1024px)
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallScreen(width < 1025);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Refs for container, logo, and nav items container to compute initial offsets
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const navRef = useRef(null);

  const [initialLogoX, setInitialLogoX] = useState(0);
  const [initialNavX, setInitialNavX] = useState(0);

  // Calculate offset for logo (as before)
  useEffect(() => {
    if (isHomepage && containerRef.current && logoRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();
      const offset = (window.innerWidth / 2) - (containerRect.left + logoRect.width / 2);
      setInitialLogoX(offset);
    }
  }, [isHomepage]);

  // Calculate offset for nav items so they are centered initially.
  useEffect(() => {
    if (isHomepage && containerRef.current && navRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const navRect = navRef.current.getBoundingClientRect();
      const centeredLeft = (containerRect.width - navRect.width) / 2;
      const rightAlignedLeft = containerRect.width - navRect.width;
      const offset = centeredLeft - rightAlignedLeft;
      setInitialNavX(offset);
    }
  }, [isHomepage]);

  // Framer Motion scroll animations for the logo (currently defined but conditionally used)
  const { scrollY } = useScroll();
  const rawLogoX = useTransform(scrollY, [0, 150], [initialLogoX, 0]);
  const rawTranslateY = useTransform(scrollY, [0, 150], [160, 0]);
  const rawScale = useTransform(scrollY, [0, 150], [6, 1]);

  // Change logo animation to be static on small screens (mobile and tablet) or when not on homepage
  const logoX = isSmallScreen || !isHomepage ? 0 : rawLogoX;
  const translateY = isSmallScreen || !isHomepage ? 0 : rawTranslateY;
  const scale = isSmallScreen || !isHomepage ? 1 : rawScale;

  // Animate nav items container’s x offset from centered to 0 (right aligned)
  const rawNavX = useTransform(scrollY, [0, 150], [initialNavX, 0]);
  const navX = isMobile || !isHomepage ? 0 : rawNavX;

  // Navbar background transition based on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 150);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Define nav item classes for the underline hover effect.
  const navItemClasses = `block py-2 transition-[border-color] ${navItemSizeClass} border-b-2 border-transparent ${
    isScrolled || isMobile ? "hover:border-black" : "hover:border-white"
  }`;

  // Use the same classes for submenu items.
  const submenuItemClasses = `block px-4 py-2 transition-[border-color] ${navItemSizeClass} border-b-2 border-transparent ${
    isScrolled || isMobile ? "hover:border-black" : "hover:border-white"
  }`;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowUserMenu(false);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black">
      <div
        className="whitespace-nowrap"
        style={{ animation: "marquee 15s linear infinite" }}
      >
        {t("Advertise")}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>

      {/* Navigation container */}
      <motion.div
        className={`w-full fixed top-auto left-0 flex items-center transition-all ${
          isScrolled || isMobile ? "bg-white text-black shadow-md py-4" : "bg-black py-8"
        }`}
      >
        <div
          ref={containerRef}
          className="container mx-auto px-6 relative z-10 flex justify-between items-center w-full"
        >
          {/* Logo container */}
          <div ref={logoRef} className="flex-shrink-0">
            <motion.div
              style={{
                x: logoX,
                y: translateY,
                scale: scale,
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
              className={`${
                isScrolled || isMobile ? "text-black" : "text-white"
              } text-4xl md:text-4xl font-bold tracking-wider`}
            >
              <div className="pointer-events-auto">
                <Link href="/"><h1>{brandName}</h1></Link>
              </div>
            </motion.div>
          </div>

          {/* Navigation items & Mobile Menu Button */}
          <div className="flex items-center">
            <motion.div
              ref={navRef}
              style={{ x: navX }}
              className="hidden xl:flex items-center justify-end space-x-8 h-full"
            >
              <ul className="flex space-x-8 h-full transition-all">
                <li className={navItemClasses}>
                  <Link href="/"><h2>{t("Home")}</h2></Link>
                </li>
                <li className={navItemClasses}>
                  <Link href="/news"><h2>{t("News")}</h2></Link>
                </li>
                <li className={navItemClasses}>
                  <Link href="/music"><h2>{t("Music")}</h2></Link>
                </li>
                <li className={navItemClasses}>
                  <Link href="/calendar"><h2>{t("Events")}</h2></Link>
                </li>
                <li className={navItemClasses}>
                  <Link href="/merch"><h2>{t("Merch")}</h2></Link>
                </li>
                <li className={navItemClasses}>
                  <Link href="/advertise"><h2>{t("Advertise")}</h2></Link>
                </li>
                <li className={navItemClasses}>
                  <Link href="/about"><h2>{t("About")}</h2></Link>
                </li>
                {/* Person Icon with Submenu */}
                <li className="relative flex items-center">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center focus:outline-none"
                  >
                    <User size={32} />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full right-0 mt-2 w-40 shadow-md rounded-md overflow-hidden z-50 ${
                          isScrolled || isMobile ? "bg-white" : "bg-black"
                        }`}
                      >
                        <ul className="flex flex-col">
                          {user ? (
                            <>
                              <li className="border-b border-black">
                                <Link
                                  href="/profile"
                                  className={submenuItemClasses}
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <h2>{t("Profile")}</h2>
                                </Link>
                              </li>
                              <li className="border-b border-black mb-2">
                                <button
                                  className={submenuItemClasses}
                                  onClick={handleLogout}
                                >
                                  <h2>{t("Logout")}</h2>
                                </button>
                              </li>
                              <li className="px-4 mb-2">
                              <LanguageSwitcher currentLocale={currentLocale} />
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="border-b border-black">
                                <Link
                                  href="/login"
                                  className={submenuItemClasses}
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <h2>{t("Login")}</h2>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/register"
                                  className={submenuItemClasses}
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <h2>{t("Register")}</h2>
                                </Link>
                              </li>
                              <li className="mb-2 pt-2 px-4 border-t border-black">
                              <LanguageSwitcher currentLocale={currentLocale} />
                              </li>
                            </>
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </ul>
            </motion.div>
            {/* Mobile menu button - now visible on screens smaller than xl (mobile and tablets) */}
            <button
              className={`xl:hidden transition-all duration-300 ${
                isScrolled || isMobile ? "text-black" : "text-white"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile drawer - now also available on tablets (screens smaller than xl) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden bg-white shadow-md mt-[60px]"
          >
            <ul className="flex flex-col space-y-6 p-6 text-lg text-gray-700">
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/"><h2>{t("Home")}</h2></Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/news"><h2>{t("News")}</h2></Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/music"><h2>{t("Music")}</h2></Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/calendar"><h2>{t("Events")}</h2></Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/merch"><h2>{t("Merch")}</h2></Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/advertise"><h2>{t("Advertise")}</h2></Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/about"><h2>{t("About")}</h2></Link>
              </li>
              {user ? (
                <>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <Link href="/profile"><h2>{t("Profile")}</h2></Link>
                  </li>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <button onClick={handleLogout}><h2>{t("Logout")}</h2></button>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <Link href="/login"><h2>{t("Login")}</h2></Link>
                  </li>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <Link href="/register"><h2>{t("Register")}</h2></Link>
                  </li>
                </>
              )}
              <li>
              <LanguageSwitcher currentLocale={currentLocale} />              
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
