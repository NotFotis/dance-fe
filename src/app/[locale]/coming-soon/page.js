"use client";
import { useState,useRef } from "react";
import { useRouter } from "next/navigation";

const UNLOCK_PASSWORD = process.env.NEXT_PUBLIC_COMING_SOON_PASSWORD || "changeme";

export default function ComingSoon() {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const audioRef = useRef(null);

  const handleUnlock = (e) => {
    e.preventDefault();
    console.log(process.env.NEXT_PUBLIC_COMING_SOON_PASSWORD);
    
    if (input === UNLOCK_PASSWORD) {
      document.cookie = "site_unlocked=true; path=/";
      setShowModal(false);
      router.refresh();
    } else {
      setError("Wrong password!");
    }
  };
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
  return (
    <div className="coming-soon-bg">
      <main className="cs-center">
        <h1 className="cs-title">Something new is coming!</h1>
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
        <audio ref={audioRef} src="/Swedish House Mafia - Wait So Long (Visualizer).mp3" /></footer>

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
                  // Eye-off icon
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" d="M3 3l18 18M9.95 9.953A3.5 3.5 0 0116.95 16.95m-1.122-1.122a3.5 3.5 0 01-4.829-4.829m-6.633 2C5.523 6.545 12 5 12 5s6.477 1.545 9.634 7.001a1 1 0 010 1c-1.305 2.27-3.1 4.21-5.45 5.44" /></svg>
                ) : (
                  // Eye icon
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5.5" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="2.5" fill="#888"/></svg>
                )}
              </button>
            </div>
            <button type="submit" className="cs-modal-btn">Enter</button>
            {error && <div className="cs-modal-error">{error}</div>}
          </form>
        </div>
      )}

      <style jsx>{`
.coming-soon-bg {
  min-height: 100vh;
  width: 100vw;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'Montserrat', 'Poppins', Arial, sans-serif;
  /* animated gradient background */
  background: linear-gradient(120deg, #191919, #222327, #111 70%);
  background-size: 200% 200%;
  animation: gradient-move 20s ease-in-out infinite;
}
@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

        .cs-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
.cs-title {
  font-size: 5vw;         /* Responsive with viewport width */
  font-size: clamp(2.2rem, 7vw, 8rem); /* Limits for both desktop and mobile */
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
  margin-top: 3rem;
  line-height: 1.1;          /* Lower opacity */
  text-shadow: 0 2px 5px #0006;
  transition: font-size 0.3s;
}

@media (max-width: 700px) {
  .coming-soon-bg {
    padding: 0;
  }
  .cs-title {
    font-size: clamp(2.2rem, 9vw, 3.4rem); /* Bigger on mobile */
    margin-top: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .cs-footer {
    flex-direction: column;
    gap: 0.6rem;
    padding: 0 0.5rem 0.8rem 0.5rem;
    width: 100vw;
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
  }
  .cs-modal-password-wrap {
    width: 100%;
    min-width: 0;
  }
}

@media (max-width: 420px) {
  .cs-title {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  .cs-modal-password-wrap {
    width: 98vw;
    min-width: 0;
  }
}

        .cs-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem 1.3rem 2.5rem;
          width: 100vw;
          box-sizing: border-box;
          position: relative;
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
        h1 {
          margin: 0;
        }
        /* Modal Styles */
        .cs-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 10;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fade-in 0.2s;
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
          .cs-title { font-size: 2rem; }
          .cs-footer { padding: 0 1rem 0.7rem 1rem; }
          .cs-modal { min-width: 0; width: 90vw; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.9);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
