"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord, FaInstagram, FaFacebook } from "react-icons/fa";

// --- Modern Animated Circular Clock ---
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
  const seconds = pad(now.getSeconds());

  return (
    <div className="digital-clock-wrap">
      <div className="digits-row">
        <span className="digits">{'['}</span>
        <div className="digits-col">
          <span className="digits">{hours}</span>
        </div>
        <span className="separator">:</span>
        <div className="digits-col">
          <span className="digits">{minutes}</span>
        </div>

                <span className="digits">{']'}</span>
      </div>
      <style jsx>{`
        .digital-clock-wrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2.5rem;
        }
        .digits-row {
          display: flex;
          align-items: flex-end;
          gap: clamp(0.6rem, 5vw, 2.1rem);
        }
        .digits-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .digits {
          font-size: clamp(2.6rem, 10vw, 4.5rem);
          font-weight: 900;
          color: #fff;
          text-shadow: 0 2px 14px #000b;
          letter-spacing: 0.04em;
        }
        .label {
          margin-top: 0.4em;
          font-size: clamp(0.75rem, 2vw, 1.1rem);
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.10em;
          opacity: 0.82;
          text-shadow: 0 1px 5px #0007;
          text-transform: uppercase;
        }
        .separator {
          font-size: clamp(2.4rem, 6vw, 3.5rem);
          color: #fff;
          margin: 0 0.1em;
          font-weight: 800;
          align-self: flex-end;
          margin-bottom: 0.12em;
        }
      `}</style>
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
    <div className="coming-soon-bg" >
      <main className="cs-center"  style={{ position: "relative", zIndex: 1 }}>
        <div className="headline">WE DANCE SOON</div>
        <DigitalClock  />
        <div className="socials">
          <a href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" rel="noopener noreferrer" className="social-link">
            <FaDiscord size={28} />
          </a>
          <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram size={28} />
          </a>
          <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-link">
            <FaFacebook size={28} />
          </a>
        </div>
      </main>
      <footer className="cs-footer">
        <button
          className="cs-footer-btn"
          aria-label="Enter admin password"
          onClick={() => { setShowModal(true); setInput(""); setError(""); }}
        >
          <header className="cs-footer-left">d</header>
        </button>
        <div className="cs-footer-divider" />
        <button
          className="cs-footer-right"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            color: "#ccc",
            fontSize: "1.1rem",
            fontWeight: 500,
            minWidth: 120,
            textAlign: "right",
            margin: 0,
          }}
          onClick={handlePlaySong}
          aria-label={isPlaying ? "Pause song" : "Play song"}
        >
          <header>dancetoday</header>
        </button>
        <audio ref={audioRef} src="/axwell-behold_Ko5Ov23u.mp3" />
      </footer>

      {showModal && (
        <div className="cs-modal-bg" onClick={() => setShowModal(false)}>
          <form
            className="cs-modal"
            onClick={e => e.stopPropagation()}
            onSubmit={handleUnlock}
            autoComplete="off"
          >
            <h1 className="cs-modal-title">Enter password</h1>
            <div className="cs-modal-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                className="cs-modal-input"
                autoFocus
                value={input}
                onChange={e => { setInput(e.target.value); setError(""); }}
                placeholder="Password"
              />
              <button
                type="button"
                className="cs-eye-btn"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" d="M3 3l18 18M9.95 9.953A3.5 3.5 0 0116.95 16.95m-1.122-1.122a3.5 3.5 0 01-4.829-4.829m-6.633 2C5.523 6.545 12 5 12 5s6.477 1.545 9.634 7.001a1 1 0 010 1c-1.305 2.27-3.1 4.21-5.45 5.44" /></svg>
                ) : (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5.5" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="2.5" fill="#888"/></svg>
                )}
              </button>
            </div>
            <button type="submit" className="cs-modal-btn">Enter</button>
            {error && <div className="cs-modal-error">{error}</div>}
          </form>
        </div>
      )}

      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden !important;
        }
      `}</style>
      <style jsx>{`
  .coming-soon-bg {
    min-height: 100vh;
    height: 100vh;
    width: 100vw;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Montserrat', 'Poppins', Arial, sans-serif;
    overflow: hidden;
    position: relative;
    background: #101012;
  }
  .coming-soon-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background: 
      linear-gradient(115deg, rgba(24,24,24,0.2) 0%, rgba(32,32,32,0.4) 100%),
      url("/63913d117113967.60704191152f1.png") center center / cover no-repeat;
    opacity: 1;
    pointer-events: none;
  }
    
        .cs-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .headline {
          font-size: clamp(1.2rem, 3vw, 2.6rem);
          font-weight: 800;
          margin-bottom: 2.2rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          text-shadow: 0 2px 12px #0007;
        }
        .socials {
          margin-top: 1.7rem;
          display: flex;
          gap: 1.1rem;
          justify-content: center;
          align-items: center;
        }
        .social-link {
          opacity: 0.88;
          transition: opacity 0.17s, transform 0.18s;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
        }
        .social-link:hover, .social-link:focus {
          opacity: 1;
          transform: scale(1.08);
          background: rgba(255,255,255,0.11);
        }
        .cs-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem 1.3rem 2.5rem;
          width: 100vw;
          box-sizing: border-box;
          position: relative;
          flex-shrink: 0;
          z-index: 1;
        }
        .cs-footer-divider {
          flex: 1;
          border-bottom: 1px solid #303030;
          margin: 0 1.5rem;
          height: 1px;
        }
        .cs-footer-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          line-height: 1;
          min-width: 34px;
          display: flex;
          align-items: center;
        }
        .cs-footer-btn:focus .cs-footer-left,
        .cs-footer-btn:hover .cs-footer-left {
          color:rgb(146, 146, 146);
        }
        .cs-footer-left {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          padding: 0;
          line-height: 1;
          letter-spacing: -0.04em;
          background: none;
        }
        .cs-footer-right {
          font-size: 1.1rem;
          color: #ccc;
          letter-spacing: 0.01em;
          font-weight: 500;
          min-width: 120px;
          text-align: right;
          margin: 0;
          padding: 0;
        }
        h1 { margin: 0; }
        .cs-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 10;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fade-in 0.2s;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          max-width: 100vw;
          max-height: 100vh;
        }
        .cs-modal {
          background: #18191e;
          border-radius: 16px;
          padding: 2.4rem 2rem 2rem 2rem;
          min-width: 300px;
          box-shadow: 0 4px 24px #0007;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: popup-in 0.18s;
          max-width: 98vw;
          max-height: 98vh;
          overflow: auto;
        }
        .cs-modal-title {
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 1.3rem;
          letter-spacing: 0.04em;
          font-weight: 700;
        }
        .cs-modal-password-wrap {
          position: relative;
          width: 300px;
          margin-bottom: 1.1rem;
          max-width: 96vw;
        }
        .cs-modal-input {
          padding: 0.7rem 1.1rem;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          outline: none;
          background: #24242a;
          color: #fff;
          width: 100%;
          font-family: inherit;
          letter-spacing: 0.06em;
          box-sizing: border-box;
          padding-right: 2.2rem;
        }
        .cs-eye-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          outline: none;
          display: flex;
          align-items: center;
          height: 100%;
          opacity: 0.7;
          transition: opacity 0.14s;
        }
        .cs-eye-btn:hover,
        .cs-eye-btn:focus {
          opacity: 1;
        }
        .cs-modal-btn {
          padding: 0.6rem 1.3rem;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          background:rgb(255, 255, 255);
          color: #000;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.04em;
          margin-bottom: 0.7rem;
          transition: background 0.18s;
        }
        .cs-modal-btn:hover {
          background:rgb(167, 167, 167);
        }
        .cs-modal-error {
          color: #ff4343;
          font-size: 0.95rem;
          margin-top: -0.5rem;
        }
        @media (max-width: 700px) {
          .coming-soon-bg {
            padding: 0;
            height: 100vh;
            min-height: 100vh;
            max-height: 100vh;
          }
          .cs-footer {
            flex-direction: column;
            gap: 0.6rem;
            padding: 0 0.5rem 0.8rem 0.5rem;
            width: 100vw;
            flex-shrink: 0;
          }
          .cs-footer-divider {
            display: none;
          }
          .cs-footer-left,
          .cs-footer-right {
            min-width: unset;
            text-align: center;
          }
          .cs-modal {
            min-width: 0;
            width: 95vw;
            padding: 1.2rem 0.7rem 1.2rem 0.7rem;
            max-height: 98vh;
          }
          .cs-modal-password-wrap {
            width: 100%;
            min-width: 0;
            max-width: 96vw;
          }
        }
        @media (max-width: 420px) {
          .cs-modal-password-wrap {
            width: 98vw;
            min-width: 0;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.9);}
          to { opacity: 1; transform: scale(1);}
        }
            .coming-soon-bg > * { position: relative; z-index: 1; }

      `}</style>
    </div>
  );
}
