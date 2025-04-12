"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";

export default function Navbar({ brandName = "dancetoday" }) {
  const t = useTranslations();
  const locale = useLocale();

  // Toggle state for the burger menu
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // User state to conditionally render login/register vs profile icon and logout button
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout handler clears user and token then closes the drawer
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false);
  };

  // Navigation items
  const navItems = [
    { href: "/", label: t("Home") },
    { href: "/news", label: t("News") },
    { href: "/music", label: t("Music") },
    { href: "/calendar", label: t("Events") },
    { href: "/merch", label: t("Merch") },
    { href: "/advertise", label: t("Advertise") },
    { href: "/about", label: t("About") },
  ];

  return (
    <>
      {/* Navbar Header */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[80vw] max-w-xl">
        <div className="bg-white text-black rounded-full px-8 py-3 flex items-center justify-between shadow-lg">
          <Link href="/" className="text-2xl font-bold">
            {brandName}
          </Link>
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* Drawer: fixed below the header */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
            className="fixed top-5 left-0 right-0 z-20"
          >
            {/* Drawer Container */}
            <div className="w-[80vw] max-w-xl mx-auto bg-white text-black shadow-lg rounded-3xl py-12">
              {/* Navigation Items */}
              <ul className="p-10 space-y-8">
                {navItems.map((item) => (
                  <li key={item.href} className="text-center">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <h2 className="text-3xl font-bold hover:underline">
                        {item.label}
                      </h2>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Bottom Section (moved lower with a top border) */}
              <div className="mt-10 border-t border-gray-300 pt-5 px-5 flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <LanguageSwitcher currentLocale={locale} />
                </div>
                <div className="flex items-center space-x-4">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        <User size={32} />
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-xl font-bold hover:underline"
                      >
                        {t("Logout")}
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-xl font-bold hover:underline"
                    >
                      {t("Login/Register")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
