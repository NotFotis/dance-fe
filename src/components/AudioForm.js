"use client";

import { useRef, useEffect } from "react";
import { createNoise3D } from "simplex-noise";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const offscreenRef = useRef({ canvas: null, ctx: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ——— Main and offscreen contexts ———
    const mainCtx = canvas.getContext("2d");
    const offCanvas = document.createElement("canvas");
    const offCtx   = offCanvas.getContext("2d");
    offscreenRef.current = { canvas: offCanvas, ctx: offCtx };

    // —— Performance params ——
    const DOWNSAMPLE    = 0.5;  // 50% resolution
    const NOISE_STEP    = 3;    // 3px blocks
    const BLUR_PX       = 20;   // blur radius
    const NOISE_FRAMES  = 3;    // regen every 3 frames

    // —— Scroll smoothing ——
    let targetScroll = window.scrollY;
    let smoothScroll = targetScroll;
    const onScroll = () => (targetScroll = window.scrollY);
    window.addEventListener("scroll", onScroll);

    // —— Resize handler ——
    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      offCanvas.width  = Math.ceil(W * DOWNSAMPLE);
      offCanvas.height = Math.ceil(H * DOWNSAMPLE);
    };
    resize();
    window.addEventListener("resize", resize);

    // —— Noise setup ——
    const noise3D = createNoise3D();
    const disappearanceScroll = 300;
    let frameCount = 0;

    // —— Render loop ——
    const render = (now) => {
      frameCount++;
      const W = canvas.width;
      const H = canvas.height;
      const w2 = offCanvas.width;
      const h2 = offCanvas.height;
      const t = now * 0.0002;

      // smooth scroll → fade
      smoothScroll += (targetScroll - smoothScroll) * 0.1;
      const fadeFactor = Math.max(1 - smoothScroll / disappearanceScroll, 0);

      // regenerate noise occasionally
      if (frameCount % NOISE_FRAMES === 0) {
        const img = offCtx.createImageData(w2, h2);
        const data = img.data;
        for (let y = 0; y < h2; y += NOISE_STEP) {
          for (let x = 0; x < w2; x += NOISE_STEP) {
            const v = noise3D(x * 0.001, y * 0.002, t) * 0.5 + 0.5;
            const shade = Math.floor(v * 25); // darker range
            for (let dy = 0; dy < NOISE_STEP; dy++) {
              for (let dx = 0; dx < NOISE_STEP; dx++) {
                const idx = 4 * ((y + dy) * w2 + (x + dx));
                data[idx] = data[idx+1] = data[idx+2] = shade;
                data[idx+3] = 255;
              }
            }
          }
        }
        offCtx.putImageData(img, 0, 0);
      }

      // clear main canvas
      mainCtx.clearRect(0, 0, W, H);

      // draw & blur offscreen → main
      mainCtx.filter = `blur(${BLUR_PX}px)`;
      mainCtx.drawImage(offCanvas, 0, 0, w2, h2, 0, 0, W, H);
      mainCtx.filter = "none";

      // strong vignette
      const grad = mainCtx.createRadialGradient(
        W/2, H/2, W/4,
        W/2, H/2, Math.max(W, H)/1.2
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.8)");
      mainCtx.fillStyle = grad;
      mainCtx.fillRect(0, 0, W, H);

      // four white fading lines
      const maxLen = Math.min(W, H) / 3;
      const len = maxLen * fadeFactor;
      mainCtx.strokeStyle = "white";
      mainCtx.lineWidth = 3;

      // left
      mainCtx.beginPath();
      mainCtx.moveTo(0, H * 0.25);
      mainCtx.lineTo(len, H * 0.25);
      mainCtx.stroke();

      // right
      mainCtx.beginPath();
      mainCtx.moveTo(W, H * 0.75);
      mainCtx.lineTo(W - len, H * 0.75);
      mainCtx.stroke();

      // top
      mainCtx.beginPath();
      mainCtx.moveTo(W * 0.75, 0);
      mainCtx.lineTo(W * 0.75, len);
      mainCtx.stroke();

      // bottom
      mainCtx.beginPath();
      mainCtx.moveTo(W * 0.25, H);
      mainCtx.lineTo(W * 0.25, H - len);
      mainCtx.stroke();

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
