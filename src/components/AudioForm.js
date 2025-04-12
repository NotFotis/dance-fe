"use client";
import { useRef, useEffect } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ===== Initialize the blob object =====
    const blob = {
      baseRadius: 200,
      hue: Math.random() * 360,
      hueShiftSpeed: 0.3,
      centerX: 0, // Updated during canvas size setting.
      centerY: 0, // Updated during canvas size setting.
      points: [],
    };

    // Create points for an irregular blob shape.
    const numPoints = 12;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const randomOffset = Math.random() * 30 - 15; // vary the radius slightly
      blob.points.push({ angle, radius: blob.baseRadius + randomOffset });
    }

    // Set and update canvas size.
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      blob.centerX = canvas.width / 2;
      blob.centerY = canvas.height / 2;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // ===== Smooth scroll setup =====
    let targetScroll = window.scrollY;
    let smoothScroll = window.scrollY;
    const handleScroll = () => {
      targetScroll = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);

    // When scroll reaches this value, lines disappear completely.
    const disappearanceScroll = 300;

    let animationFrameId;

    // ===== Render Loop =====
    const render = () => {
      const { width, height } = canvas;
      // Smoothly interpolate the scroll value.
      smoothScroll += (targetScroll - smoothScroll) * 0.1;

      // Clear the canvas.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // ---------- Draw the central blob with a shifting gradient ----------
      // blob.hue = (blob.hue + blob.hueShiftSpeed) % 360;
      // const gradient = ctx.createRadialGradient(
      //   blob.centerX,
      //   blob.centerY,
      //   0,
      //   blob.centerX,
      //   blob.centerY,
      //   blob.baseRadius + 30
      // );
      // gradient.addColorStop(0, `hsla(${blob.hue}, 100%, 60%, 0.6)`);
      // gradient.addColorStop(0.5, `hsla(${(blob.hue + 30) % 360}, 100%, 60%, 0.3)`);
      // gradient.addColorStop(1, `hsla(${(blob.hue + 60) % 360}, 100%, 60%, 0)`);

      // ctx.globalCompositeOperation = "lighter";
      // ctx.beginPath();
      // for (let i = 0; i < blob.points.length; i++) {
      //   const { angle, radius } = blob.points[i];
      //   const x = blob.centerX + Math.cos(angle) * radius;
      //   const y = blob.centerY + Math.sin(angle) * radius;
      //   if (i === 0) ctx.moveTo(x, y);
      //   else ctx.lineTo(x, y);
      // }
      // ctx.closePath();
      // ctx.fillStyle = gradient;
      // ctx.fill();

      // ---------- Draw 4 white lines at a fixed 90° orientation ----------
      const maxLineLength = Math.min(width, height) / 3;
      // Calculate a factor (1 to 0) based on scroll: when smoothScroll reaches disappearanceScroll the lines vanish.
      const factor = Math.max(1 - smoothScroll / disappearanceScroll, 0);
      const visibleLength = maxLineLength * factor;

      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;

      // Left line: on the left edge, upper half, horizontal (extending right).
      ctx.beginPath();
      ctx.moveTo(0, height * 0.25);
      ctx.lineTo(visibleLength, height * 0.25);
      ctx.stroke();

      // Right line: on the right edge, bottom half, horizontal (extending left).
      ctx.beginPath();
      ctx.moveTo(width, height * 0.75);
      ctx.lineTo(width - visibleLength, height * 0.75);
      ctx.stroke();

      // Top line: on the top edge, right-half, vertical (extending downward).
      ctx.beginPath();
      ctx.moveTo(width * 0.75, 0);
      ctx.lineTo(width * 0.75, visibleLength);
      ctx.stroke();

      // Bottom line: on the bottom edge, left-half, vertical (extending upward).
      ctx.beginPath();
      ctx.moveTo(width * 0.25, height);
      ctx.lineTo(width * 0.25, height - visibleLength);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // ===== Cleanup =====
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
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
