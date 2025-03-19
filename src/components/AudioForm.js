"use client";
import { useRef, useEffect } from "react";

export default function AudioForm() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Configuration for the wave lines
    const numLines = 5;
    const baseFrequency = 0.01; // Base frequency for the waves
    const lineSpacing = 15; // Vertical spacing between lines

    // Create wave configurations
    const waves = Array.from({ length: numLines }, (_, i) => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      amplitude: 30 + Math.random() * 20, // Base amplitude for the wave
      frequency: baseFrequency + (Math.random() - 0.5) * 0.005,
      offset: (i - Math.floor(numLines / 2)) * lineSpacing,
      segments: [] // Will store random multipliers for each period
    }));

    // Function declaration for updating wave segments
    // Each segment covers one period of the wave (2π / frequency)
    // and provides a random multiplier (between 0.5 and 1.5) for that segment.
    function updateWaveSegments() {
      waves.forEach((wave) => {
        const periodLength = (2 * Math.PI) / wave.frequency;
        const numSegments = Math.ceil(canvas.width / periodLength) + 1;
        wave.segments = Array.from({ length: numSegments }, () => 0.5 + Math.random());
      });
    }

    // Function to set canvas dimensions and update wave segments
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateWaveSegments();
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerY = canvas.height / 2;
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 150, 136, 0.7)";

      waves.forEach((wave) => {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
          const periodLength = (2 * Math.PI) / wave.frequency;
          const segIndex = Math.floor(x / periodLength);
          const segFraction = (x % periodLength) / periodLength;
          const segValue1 = wave.segments[segIndex] || 1;
          const segValue2 = wave.segments[segIndex + 1] || 1;
          const amplitudeFactor = (1 - segFraction) * segValue1 + segFraction * segValue2;
          const effectiveAmplitude = wave.amplitude * amplitudeFactor;
          const y =
            centerY + wave.offset + effectiveAmplitude * Math.sin(wave.frequency * x + wave.phase);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        // Update phase so that the wave animates independently
        wave.phase += wave.speed;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas className="bg-black"
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // So it doesn't block user interactions
        zIndex: -1,
      }}
    />
  );
}
