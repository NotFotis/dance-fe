"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function CountdownClock({ onTick, countdownStart }) {
  const getTarget = () => {
    const t = new Date();
    t.setMonth(10 - 1);
    t.setDate(1);
    t.setHours(0, 0, 0, 0);
    if (new Date() > t) t.setFullYear(t.getFullYear() + 1);
    return t;
  };
  function getTimeLeft(target) {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, now };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, now };
  }
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    const target = getTarget();
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => {
      const current = getTimeLeft(target);
      setTimeLeft(current);
      if (onTick) {
        onTick(current.now);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [onTick]);
  const pad = n => String(n).padStart(2, "0");
  if (!timeLeft) return <div style={{ minHeight: 80 }} />;
  const { days, hours, minutes, seconds } = timeLeft;
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex items-end gap-4 tabular-nums">
          <span className="font-extrabold text-white text-4xl md:text-7xl lg:text-7xl drop-shadow-lg">[</span>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-white text-4xl md:text-6xl lg:text-6xl drop-shadow-lg">{pad(days)}</span>
          </div>
          <span className="font-extrabold text-white text-4xl md:text-7xl lg:text-6xl drop-shadow-lg">:</span>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-white text-4xl md:text-6xl lg:text-6xl drop-shadow-lg">{pad(hours)}</span>
          </div>
          <span className="font-extrabold text-white text-4xl md:text-7xl lg:text-6xl drop-shadow-lg">:</span>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-white text-4xl md:text-6xl lg:text-6xl drop-shadow-lg">{pad(minutes)}</span>
          </div>
          <span className="font-extrabold text-white text-4xl md:text-7xl lg:text-6xl drop-shadow-lg">:</span>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-white text-4xl md:text-6xl lg:text-6xl drop-shadow-lg">{pad(seconds)}</span>
          </div>
          <span className="font-extrabold text-white text-4xl md:text-7xl lg:text-7xl drop-shadow-lg">]</span>
        </div>
        <div className="flex gap-5 md:gap-10 mt-2">
          <span className="text-xs md:text-base lg:text-lg text-gray-200 font-semibold w-12 text-center tracking-wide">DAYS</span>
          <span className="w-1" />
          <span className="text-xs md:text-base lg:text-lg text-gray-200 font-semibold w-12 text-center tracking-wide">HRS</span>
          <span className="w-1" />
          <span className="text-xs md:text-base lg:text-lg text-gray-200 font-semibold w-12 text-center tracking-wide">MIN</span>
          <span className="w-1" />
          <span className="text-xs md:text-base lg:text-lg text-gray-200 font-semibold w-12 text-center tracking-wide">SEC</span>
        </div>
      </div>
    </div>
  );
}

const UNLOCK_PASSWORD = process.env.NEXT_PUBLIC_COMING_SOON_PASSWORD || "changeme";

export default function ComingSoon() {
  const [showUnmuteOverlay, setShowUnmuteOverlay] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showMain, setShowMain] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [audioHasStarted, setAudioHasStarted] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [pressed, setPressed] = useState(false);

  const [pausedAt, setPausedAt] = useState(null);
  const [wasPlaying, setWasPlaying] = useState(false);

  const router = useRouter();
  const audioRef = useRef(null);
  const countdownStartRef = useRef(Date.now());

  // Preload BG image
  useEffect(() => {
    if (typeof window === "undefined") return;
    const img = new window.Image();
    img.src = "/63913d117113967.60704191152f1.webp";
    img.onload = () => setBgLoaded(true);
  }, []);

  // Unmute overlay - click to enter
  useEffect(() => {
    if (!showUnmuteOverlay) return;
    const hide = () => setShowUnmuteOverlay(false);
    window.addEventListener("click", hide, { once: true });
    // window.addEventListener("keydown", hide, { once: true });
    return () => {
      window.removeEventListener("click", hide, { once: true });
      // window.removeEventListener("keydown", hide, { once: true });
    };
  }, [showUnmuteOverlay]);

  useEffect(() => {
    if (!isMuted) setShowUnmuteOverlay(false);
  }, [isMuted]);

  // Animation on press & fade-out
  const handleUnmute = e => {
    e.stopPropagation();
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    setIsFadingOut(true); // start fade-out
    setIsMuted(false);
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.muted = false;
      audio.play().catch(() => {});
    }
    setTimeout(() => {
      setShowUnmuteOverlay(false); // unmount overlay after fade
      setShowMain(true); // show main content (no animation)
      setIsFadingOut(false);
    }, 300); // match fade duration
  };

  // Attempt to play audio on first interaction
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    const tryPlay = () => {
      if (audio.paused) {
        audio.muted = isMuted;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.catch(() => {});
        }
      }
    };
    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
    return () => {
      window.removeEventListener("click", tryPlay, { once: true });
      window.removeEventListener("keydown", tryPlay, { once: true });
    };
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  // Handle tab visibility: pause and remember, then resume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        setWasPlaying(!audio.paused);
        setPausedAt(audio.currentTime);
        audio.pause();
      } else if (document.visibilityState === "visible") {
        if (wasPlaying && pausedAt != null) {
          audio.currentTime = pausedAt;
          audio.muted = isMuted;
          audio.play().catch(() => {});
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line
  }, [isMuted, wasPlaying, pausedAt]);

  // Reset pause state when audio is unmuted and played by user
  useEffect(() => {
    const audio = audioRef.current;
    if (!isMuted && audio && !audio.paused) {
      setPausedAt(null);
      setWasPlaying(false);
    }
  }, [isMuted]);

  // Handle countdown ticks (start audio only once)
  const handleCountdownTick = (now) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioHasStarted) {
      // DO NOT set audio.currentTime here, just play from start
      audio.muted = isMuted;
      audio.loop = true;
      const playPromise = audio.play();
      setAudioHasStarted(true);
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
    }
    audio.muted = isMuted;
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (input === UNLOCK_PASSWORD) {
      document.cookie = "site_unlocked=true; path=/";
      setShowModal(false);
      router.refresh();
    } else {
      setError("Wrong password!");
    }
  };

  const handleGlobalClick = (e) => {
    setShowMain(true); // Only now show main content
    if (!showModal) {
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <div
      className={`min-h-dvh w-full flex flex-col font-montserrat bg-black overflow-hidden relative`}
      onClick={handleGlobalClick}
      style={{ cursor: "pointer" }}
    >
      {/* UNMUTE OVERLAY (fade-out) */}
      <AnimatePresence>
        {showUnmuteOverlay && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ pointerEvents: isFadingOut ? "none" : "auto" }}
          >
            <motion.button
              className={`
                flex flex-col bg-transparent items-center justify-center rounded-full px-10 py-7 shadow-2xl font-bold text-2xl gap-3
                min-w-[50px] min-h-[50px]
                transition-transform duration-150
                ${pressed ? "scale-110" : "scale-100"}
              `}
              style={{ background: "rgba(0,0,0,1)" }}
              whileTap={{ scale: 1.08 }}
              aria-label="Unmute music"
              onClick={handleUnmute}
              onAnimationEnd={() => setPressed(false)}
            >
              PRESS TO ENTER
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BG image and overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/63913d117113967.60704191152f1.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0" />
      </div>

      {/* MAIN CONTENT */}
      {showMain && (
        <main className="flex-1 flex flex-col items-center justify-start z-10 relative">
          <div
            className="absolute left-1/2"
            style={{
              top: "53%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="text-white font-extrabold text-2xl md:text-3xl lg:text-3xl xl:text-4xl mb-8 mt-8 tracking-wide uppercase text-center drop-shadow-xl">
              WE DANCE SOON
            </div>
            <CountdownClock onTick={handleCountdownTick} countdownStart={countdownStartRef.current} />
            <div className="flex gap-5 mt-8">
              <a
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:scale-105 transition"
                tabIndex={-1}
              >
                <FaInstagram size={28} className="text-white opacity-90 hover:opacity-100" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:scale-105 transition"
                tabIndex={-1}
              >
                <FaDiscord size={28} className="text-white opacity-90 hover:opacity-100" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:scale-105 transition"
                tabIndex={-1}
              >
                <FaTiktok size={28} className="text-white opacity-90 hover:opacity-100" />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 hover:scale-105 transition"
                tabIndex={-1}
              >
                <FaFacebook size={28} className="text-white opacity-90 hover:opacity-100" />
              </a>
            </div>
          </div>
        </main>
      )}

      {/* Footer and Modal */}
      {showMain && (
        <footer
          className="z-20 relative w-full flex items-center justify-between px-6 md:px-10 pb-7"
          style={{ paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))" }}
        >
          <button
            className="bg-transparent border-none p-0 m-0 cursor-pointer min-w-[34px] flex items-center group"
            aria-label="Enter admin password"
            onClick={e => {
              e.stopPropagation();
              setShowModal(true);
              setInput("");
              setError("");
            }}
          >
            <span className="text-white text-2xl font-extrabold group-hover:text-gray-400 transition">
              <header>d</header>
            </span>
          </button>
          <div className="flex-1 border-b border-[#303030] mx-6" />
          <header className="bg-transparent border-none p-0 text-[#ccc] text-base font-medium min-w-[120px] text-right flex items-center gap-2">
            dancetoday
          </header>
          <audio ref={audioRef} src="/dance clock.mp3" />
        </footer>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <form
            className="bg-[#18191e] rounded-2xl p-8 min-w-[300px] max-w-[96vw] shadow-2xl flex flex-col items-center"
            onClick={e => e.stopPropagation()}
            onSubmit={handleUnlock}
            autoComplete="off"
          >
            <h1 className="text-white text-xl font-bold mb-6 tracking-wide">Enter password</h1>
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full py-3 px-4 pr-12 rounded-lg bg-[#24242a] text-white text-base outline-none font-medium tracking-wide"
                autoFocus
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  setError("");
                }}
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path stroke="#888" strokeWidth="2" d="M3 3l18 18M9.95 9.953A3.5 3.5 0 0116.95 16.95m-1.122-1.122a3.5 3.5 0 01-4.829-4.829m-6.633 2C5.523 6.545 12 5 12 5s6.477 1.545 9.634 7.001a1 1 0 010 1c-1.305 2.27-3.1 4.21-5.45 5.44" />
                  </svg>
                ) : (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="12" rx="8" ry="5.5" stroke="#888" strokeWidth="2" />
                    <circle cx="12" cy="12" r="2.5" fill="#888" />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              className="py-3 px-8 rounded-lg bg-white text-black font-bold text-base mt-2 mb-3 hover:bg-gray-200 transition"
            >
              Enter
            </button>
            {error && <div className="text-red-500 text-base mt-1">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
