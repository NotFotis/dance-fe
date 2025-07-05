"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaInstagram, FaFacebook } from "react-icons/fa";
import '@/app/[locale]/globals.css'

function useTime() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export default function NotFoundPage() {
  const router = useRouter();
  const [bgLoaded, setBgLoaded] = useState(false);
  useEffect(() => {
    const img = new window.Image();
    img.src = "/63913d117113967.60704191152f1.webp";
    img.onload = () => setBgLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/63913d117113967.60704191152f1.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: bgLoaded ? 1 : 0.5, transition: "opacity 0.7s" }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center z-10 mt-40">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-end gap-5 md:gap-8 mb-2 select-none">
            <span className="font-extrabold text-white text-7xl md:text-8xl lg:text-9xl drop-shadow-lg">[</span>
            <span className="font-extrabold text-white text-7xl md:text-8xl lg:text-9xl drop-shadow-lg">404</span>
            <span className="font-extrabold text-white text-7xl md:text-8xl lg:text-9xl drop-shadow-lg">]</span>
          </div>
          <div className="text-white text-2xl md:text-3xl font-bold uppercase drop-shadow-lg mb-2 text-center">
            Page Not Found
          </div>
          <div className="text-gray-300 text-lg md:text-xl mb-2 text-center max-w-xl">
            Oops! The page you’re looking for doesn’t exist.<br />
            Maybe you followed a broken link, or danced your way into the void.
          </div>
          {/* Go Home Button directly under text & clock */}
          <button
            className="mt-8 bg-white/90 hover:bg-white text-black px-7 py-3 rounded-xl font-bold text-base shadow-lg transition"
            onClick={() => router.push("/")}
          >
            Go Home
          </button>
        </div>
      </main>

      {/* Socials centered at footer */}
      <footer className="flex items-center justify-center px-4 pb-7 w-full z-10 justify-center">
        <div className=" flex gap-3">
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

      </footer>
      <div className="flex items-center justify-center px-4 pb-7 w-full z-10 justify-center">
           <span><header>dancetoday</header></span> 
          </div>
    </div>
  );
}
