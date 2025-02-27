"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user"); // Clear corrupted data
      }
    } else {
      setUser(null);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 w-5/6 sm:w-1/4 z-50 bg-black bg-opacity-100 backdrop-blur-md text-white rounded-3xl shadow-lg px-3 py-3 sm:px-3 sm:py-3">
      <div className="flex justify-between items-center w-full h-full">
        <Link href="/">
          <span className="text-lg sm:text-sm font-bold cursor-pointer tracking-wide font-yaro px-3">
            dancetoday
          </span>
        </Link>

        <button
          className="relative px-4 py-2 bg-white text-black rounded-3xl font-bold font-sans text-lg sm:text-xs ml-auto mr-0"
          onClick={toggleMenu}
        >
          {isMenuOpen ? "CLOSE" : "MENU"}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full bg-black bg-opacity-100 backdrop-blur-md rounded-xl flex flex-col items-center py-8 space-y-8 sm:py-4 sm:space-y-4"
          >
            <NavItem href="/" label="HOME" onClick={toggleMenu} />
            <NavItem href="#events" label="EVENTS" onClick={toggleMenu} />
            <NavItem href="/news" label="NEWS" onClick={toggleMenu} />
            <NavItem href="#contact" label="CONTACT" onClick={toggleMenu} />

            {user ? (
              <button
                onClick={() => router.push(`/profile`)}
                className="w-full py-5 bg-white text-black font-bold text-2xl sm:text-lg rounded-xl mt-8 hover:bg-gray-300 transition"
              >
                Profile
              </button>
            ) : (
              <button
                onClick={() => router.push(`/login`)}
                className="w-full py-5 bg-white text-black font-bold text-2xl sm:text-lg rounded-xl mt-8 hover:bg-gray-300 transition"
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const NavItem = ({ href, label, onClick }) => (
  <Link href={href} onClick={onClick}>
    <motion.span
      whileHover={{ scale: 1.1, borderBottom: "2px solid white" }}
      className="cursor-pointer pb-3 transition-all font-sans text-3xl sm:text-lg"
    >
      {label}
    </motion.span>
  </Link>
);
