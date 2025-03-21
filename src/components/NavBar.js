"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHomepage = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Determine if we're on mobile (width < 768px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load user from localStorage (similar to your ProfilePage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Framer Motion scroll animations for the logo
  const { scrollY } = useScroll();
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

  const navOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  // Logout clears auth data and redirects to login
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

      {/* Navigation container */}
      <motion.div
        className={`w-full fixed top-auto left-0 flex items-center transition-all duration-300 ${
          isScrolled || isMobile ? "bg-white text-black shadow-md py-4" : "bg-black py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 w-full relative">
          {/* Logo container */}
          <div
            className={
              isHomepage
                ? "absolute left-1/2 -translate-x-1/2 pointer-events-none"
                : "flex-shrink-0"
            }
          >
            <motion.div
              style={{
                x: isMobile || !isHomepage ? 0 : translateX,
                y: isMobile || !isHomepage ? 0 : translateY,
                scale: isMobile || !isHomepage ? 1 : scale,
                willChange: "transform",
                transformStyle: "preserve-3d",
              }}
              className={`${
                isScrolled || isMobile ? "text-black" : "text-white"
              } text-4xl md:text-4xl font-bold tracking-wider`}
            >
              <div className="pointer-events-auto">
                <Link href="/">dancetoday</Link>
              </div>
            </motion.div>
          </div>

          {/* Navigation items */}
          <div
            className={`flex-1 flex items-center ${
              isHomepage
                ? !isScrolled && !isMobile
                  ? "justify-center"
                  : "justify-end"
                : "justify-end"
            }`}
          >
            <motion.ul
              style={{
                opacity: isMobile ? 1 : navOpacity,
                pointerEvents: isScrolled ? "none" : "auto",
              }}
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
              {/* User Icon Button as a list item */}
              <li className="relative">
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
                      className="absolute top-full right-0 mt-2 w-40 bg-white shadow-md rounded-md overflow-hidden z-50"
                    >
                      <ul className="flex flex-col">
                        {user ? (
                          <>
                            <li className="border-b border-gray-200">
                              <Link
                                href="/profile"
                                className="block px-4 py-2 hover:bg-gray-800 bg-black"
                                onClick={() => setShowUserMenu(false)}
                              >
                                Profile
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={handleLogout}
                                className="w-full text-left block px-4 py-2 hover:bg-gray-800 bg-black"
                              >
                                Logout
                              </button>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="border-b border-gray-200">
                              <Link
                                href="/login"
                                className="block px-4 py-2 hover:bg-gray-800 bg-black"
                                onClick={() => setShowUserMenu(false)}
                              >
                                Login
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/register"
                                className="block px-4 py-2 hover:bg-gray-800 bg-black"
                                onClick={() => setShowUserMenu(false)}
                              >
                                Register
                              </Link>
                            </li>
                          </>
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </motion.ul>

            {/* Mobile menu button */}
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

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md mt-[60px]"
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
              {/* Mobile: show authentication items directly */}
              {user ? (
                <>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <Link href="/login">Login</Link>
                  </li>
                  <li className="hover:text-grey-700 cursor-pointer">
                    <Link href="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
