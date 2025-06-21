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
    {/* Animated abstract background */}
    <section className="radial-bg" />
    {/* Noise overlay to eliminate banding */}
    <div className="noise-overlay" />
    {/* Animated canvas with lines */}
    {shouldShowLines && <canvas ref={canvasRef} className="lines-canvas" />}

    <style jsx>{`
      .radial-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -2;
        background: linear-gradient(
          135deg,
          rgba(10,10,10,1) 0%,
          rgba(11,11,11,0.995) 7%,
          rgba(12,12,12,0.99) 14%,
          rgba(13,13,13,0.985) 21%,
          rgba(14,14,14,0.98) 28%,
          rgba(15,15,15,0.978) 35%,
          rgba(16,16,16,0.976) 42%,
          rgba(17,17,17,0.974) 49%,
          rgba(18,18,18,0.972) 56%,
          rgba(19,19,19,0.97) 63%,
          rgba(20,20,20,0.968) 70%,
          rgba(17,17,17,0.966) 77%,
          rgba(14,14,14,0.964) 85%,
          rgba(0,0,0,1) 100%
        );
        background-size: 200% 200%;
        animation: animateBackground 60s ease-in-out infinite;
      }
      .noise-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        opacity: 0.07;
        /* SVG seamless noise (no requests, cross-browser) */
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23noise)'/></svg>");
        background-repeat: repeat;
        background-size: 140px 140px;
        mix-blend-mode: overlay;
      }
      .lines-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }
      @keyframes animateBackground {
        0% { background-position: 100% 100%; }
        50% { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
      }
    `}</style>
  </>
);

}
