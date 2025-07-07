"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnimatedBackground({ showOnHomeOnly = true }) {
  const canvasRef = useRef(null);
  const pathname = usePathname();
  const shouldShowLines = showOnHomeOnly
    ? ["/en", "/el"].includes(pathname)
    : true;

  useEffect(() => {
    if (!shouldShowLines) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let targetScroll = window.scrollY;
    let smoothScroll = targetScroll;
    const onScroll = () => (targetScroll = window.scrollY);
    window.addEventListener("scroll", onScroll);

    const dpr = window.devicePixelRatio || 1;
    let W = window.innerWidth;
    let H = window.innerHeight;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const LINE_FADE_END = 300;
    const LERP = 0.02;
    let rafId;

    const render = () => {
      smoothScroll += (targetScroll - smoothScroll) * LERP;
      ctx.clearRect(0, 0, W, H);

      const fade = Math.max(1 - smoothScroll / LINE_FADE_END, 0);
      if (fade > 0) {
        const maxLen = (Math.min(W, H) / 3) * fade;
        ctx.strokeStyle = `rgba(150,150,150,${0.6 * fade})`;
        ctx.lineWidth = 2 + fade;

        // left
        ctx.beginPath();
        ctx.moveTo(0, H * 0.25);
        ctx.lineTo(maxLen, H * 0.25);
        ctx.stroke();
        // right
        ctx.beginPath();
        ctx.moveTo(W, H * 0.75);
        ctx.lineTo(W - maxLen, H * 0.75);
        ctx.stroke();
        // top
        ctx.beginPath();
        ctx.moveTo(W * 0.75, 0);
        ctx.lineTo(W * 0.75, maxLen);
        ctx.stroke();
        // bottom
        ctx.beginPath();
        ctx.moveTo(W * 0.25, H);
        ctx.lineTo(W * 0.25, H - maxLen);
        ctx.stroke();
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [shouldShowLines]);

  return (
    <>
      {/* Video background */}
      <video
        className="fixed inset-0 w-screen h-screen object-cover blur pointer-events-none z-[-20]"
        src="/3868677-hd_1920_1080_25fps.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 w-full h-full z-[-10] pointer-events-none opacity-10 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>\")",
          backgroundRepeat: "repeat",
          backgroundSize: "140px 140px",
        }}
      />

      {/* Animated canvas lines */}
      {shouldShowLines && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
      )}
    </>
  );
}
