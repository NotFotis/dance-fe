"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaInstagram, FaFacebook } from "react-icons/fa";

function useTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

function DigitalClock() {
  const now = useTime();
  const pad = n => String(n).padStart(2, "0");
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());

  return (
    <div className="w-full flex items-center justify-center mb-10">
      <div className="flex items-end gap-6 md:gap-8">
        <span className="font-extrabold text-white text-5xl md:text-7xl lg:text-8xl drop-shadow-lg ">[</span>
        <span className="font-extrabold text-white text-5xl md:text-7xl lg:text-8xl drop-shadow-lg">{hours}</span>
        <span className="font-extrabold text-white text-5xl md:text-7xl lg:text-8xl drop-shadow-lg ">:</span>
        <span className="font-extrabold text-white text-5xl md:text-7xl lg:text-8xl drop-shadow-lg">{minutes}</span>
        <span className="font-extrabold text-white text-5xl md:text-7xl lg:text-8xl drop-shadow-lg ">]</span>
      </div>
    </div>
  );
}

const UNLOCK_PASSWORD = process.env.NEXT_PUBLIC_COMING_SOON_PASSWORD || "changeme";

export default function ComingSoon() {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const audioRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/63913d117113967.60704191152f1.webp";
    img.onload = () => setBgLoaded(true);
  }, []);

  // Play/pause logic
  const handlePlaySong = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // AUTOPLAY & LOOP
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
      const updateState = () => setIsPlaying(!audio.paused);
      audio.addEventListener("play", updateState);
      audio.addEventListener("pause", updateState);
      return () => {
        audio.removeEventListener("play", updateState);
        audio.removeEventListener("pause", updateState);
      };
    }
  }, []);

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

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between font-montserrat bg-black overflow-hidden">
      {/* BG layers */}
      <div className="absolute inset-0 z-0">
        {/* Fast fallback gradient */}
        <div className="absolute inset-0 " />
        {/* Blurry placeholder */}

        {/* Actual BG */}
        <img
          src="/63913d117113967.60704191152f1.webp"
          alt=""
          className={`absolute inset-0 w-full h-full object-cover`}
          draggable={false}
        />
      </div>

<div className="min-h-screen flex flex-col bg-black">
  <main className="flex-1 flex flex-col items-center justify-center relative z-10">
    <div className="text-white font-extrabold text-2xl md:text-3xl lg:text-4xl mb-8 mt-8 tracking-wide uppercase text-center drop-shadow-xl">
      WE DANCE SOON
    </div>
    <DigitalClock />
    <div className="flex gap-5">
      <a href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 hover:scale-105 transition">
        <FaDiscord size={28} className="text-white opacity-90 hover:opacity-100" />
      </a>
      <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 hover:scale-105 transition">
        <FaInstagram size={28} className="text-white opacity-90 hover:opacity-100" />
      </a>
      <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 hover:scale-105 transition">
        <FaFacebook size={28} className="text-white opacity-90 hover:opacity-100" />
      </a>
    </div>
  </main>
  <footer className="flex items-center justify-between px-10 pb-7 w-full relative z-10">
    <button
      className="bg-transparent border-none p-0 m-0 cursor-pointer min-w-[34px] flex items-center group"
      aria-label="Enter admin password"
      onClick={() => { setShowModal(true); setInput(""); setError(""); }}
    >
      <span className="text-white text-2xl font-extrabold group-hover:text-gray-400 transition"><header>d</header></span>
    </button>
    <div className="flex-1 border-b border-[#303030] mx-6" />
    <button
      className="bg-transparent border-none cursor-pointer p-0 text-[#ccc] text-base font-medium min-w-[120px] text-right"
      onClick={handlePlaySong}
      aria-label={isPlaying ? "Pause song" : "Play song"}
    >
      <span><header>dancetoday</header></span>
    </button>
    <audio ref={audioRef} src="/axwell-behold_Ko5Ov23u.mp3" />
  </footer>
</div>


      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setShowModal(false)}>
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
                onChange={e => { setInput(e.target.value); setError(""); }}
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
                  // Eye Off Icon
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" d="M3 3l18 18M9.95 9.953A3.5 3.5 0 0116.95 16.95m-1.122-1.122a3.5 3.5 0 01-4.829-4.829m-6.633 2C5.523 6.545 12 5 12 5s6.477 1.545 9.634 7.001a1 1 0 010 1c-1.305 2.27-3.1 4.21-5.45 5.44" /></svg>
                ) : (
                  // Eye Icon
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5.5" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="2.5" fill="#888"/></svg>
                )}
              </button>
            </div>
            <button type="submit" className="py-3 px-8 rounded-lg bg-white text-black font-bold text-base mt-2 mb-3 hover:bg-gray-200 transition">
              Enter
            </button>
            {error && <div className="text-red-500 text-base mt-1">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
