"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);

  // Determine if we're on mobile (width < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Framer Motion hook to get the current scroll position
  const { scrollY } = useScroll();

  // Animation transforms for desktop
  const translateX = useTransform(scrollY, [0, 150], [50, 0]);
  const translateY = useTransform(scrollY, [0, 150], [160, 0]);
  const scale = useTransform(scrollY, [0, 150], [6, 1]);

  // Navbar background transition based on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 150);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Fading out nav items as we scroll
  const navOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black">
              <div
          className="whitespace-nowrap"
          style={{ animation: "marquee 15s linear infinite" }}
        >
          {/* Replace the text below with your ad or custom content */}
          Your ad text goes here - check out our latest offers! &nbsp;&nbsp;&nbsp; Your ad text goes here - check out our latest offers!
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
      {/* Navigation container with dynamic background and padding */}
      <motion.div
        className={`w-full fixed top-auto left-0 flex items-center transition-all duration-300 ${
          isScrolled || isMobile ? "bg-white text-black shadow-md py-4" : "bg-black py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 w-full relative">
          {/* Logo container: centered on homepage; left-aligned when not */}
          <div className={isHomepage ? "absolute left-1/2 -translate-x-1/2" : "flex-shrink-0"}>
            <motion.div
              style={{
                x: isMobile || !isHomepage ? 0 : translateX,
                y: isMobile || !isHomepage ? 0 : translateY,
                scale: isMobile || !isHomepage ? 1 : scale,
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
              className={`${isScrolled || isMobile ? "text-black" : "text-white"} text-4xl md:text-4xl font-bold tracking-wider`}
            >
              <Link href="/">dancetoday</Link>
            </motion.div>
          </div>

          {/* Navigation items container */}
          <div className={`flex-1 flex items-center ${isHomepage ? (!isScrolled && !isMobile ? "justify-center" : "justify-end") : "justify-end"}`}>
            <motion.ul
              style={{ opacity: isMobile ? 1 : navOpacity }}
              className={`hidden md:flex space-x-8 text-lg transition-all duration-300 ${
                isScrolled || isMobile ? "text-gray-700" : "text-white"
              }`}
            >
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/news">News</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/music">Music</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/calendar">Events</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/merch">Merch</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/advertise">Advertise</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/about">About</Link>
              </li>
            </motion.ul>
            <button
              className={`md:hidden transition-all duration-300 ${
                isScrolled || isMobile ? "text-gray-700" : "text-white"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md mt-[80px]"
          >
            <ul className="flex flex-col space-y-6 p-6 text-lg text-gray-700">
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/">Home</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/news">News</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/music">Music</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
              <Link href="/calendar">Events</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/merch">Merch</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/advertise">Advertise</Link>
              </li>
              <li className="hover:text-grey-700 cursor-pointer">
                <Link href="/about">About</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
