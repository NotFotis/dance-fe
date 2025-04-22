import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

const CARD_OFFSET = 20;
const SCALE_FACTOR = 0.04;
const SWIPE_DISTANCE = 1000;
const SPRING = { type: "spring", stiffness: 100, damping: 30 };
const VISIBLE_COUNT = 4;

// Memoized SwipeCard to prevent unnecessary re-renders
const SwipeCard = memo(function SwipeCard({ card, pos, total, onSwipe }) {
  const controls = useAnimation();
  const canDrag = pos === 0;

  // Animate on position change
  useEffect(() => {
    controls.start({
      y: pos * -CARD_OFFSET,
      scale: 1 - pos * SCALE_FACTOR,
      zIndex: total - pos,
      transition: SPRING,
    });
  }, [pos, total, controls]);

  // Handle drag end only for top card
  const handleDragEnd = useCallback(async (_evt, info) => {
    if (!canDrag) return;
    const dir = info.offset.x >= 0 ? 1 : -1;
    await controls.start({ x: dir * SWIPE_DISTANCE, transition: { duration: 0.2 } });
    controls.set({ x: 0 });
    onSwipe();
  }, [canDrag, controls, onSwipe]);

  // Only render a few cards for performance
  if (total > VISIBLE_COUNT && pos >= VISIBLE_COUNT) return null;

  return (
    <motion.li
      key={card.id}
      className={`${card.bg} ${card.textCol} rounded-2xl drop-shadow-2xl overflow-hidden absolute w-full h-full flex flex-col cursor-${canDrag ? "grab active:cursor-grabbing" : "auto"}`}
      style={{ willChange: "transform, top" }}
      animate={controls}
      layout={false}
      drag={canDrag ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      whileTap={canDrag ? { scale: 1.08 } : undefined}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 flex-1">
        <h3 className="text-2xl font-bold mb-2">{card.title}</h3>
        <p className="text-lg">{card.text}</p>
      </div>
    </motion.li>
  );
});

export default function SwipeableStack({ apiUrl }) {
  const t = useTranslations("about");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`${apiUrl}/about?populate=*`)
      .then((res) => {
        const data = res.data.data;
        const blocks = Array.isArray(data.blocks) ? data.blocks : [];
        setCards(
          blocks.map((b, i) => ({
            id: b.id ?? i,
            title: b.title ?? data.title ?? "No Title",
            text: b.body ?? "",
            bg: COLORS[i % COLORS.length].bg,
            textCol: COLORS[i % COLORS.length].text,
          }))
        );
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const total = cards.length;
  const handleSwipe = useCallback(() => {
    setCurrentIndex((idx) => (idx + 1) % total);
  }, [total]);
  const jumpTo = useCallback((idx) => {
    setCurrentIndex(idx);
  }, []);

  if (loading) return <div className="text-center py-8">Loading…</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading cards.</div>;
  if (!cards.length) return <div className="text-center py-8">No cards available.</div>;

  return (
    <section className="mb-12">
      <div className="container mx-auto px-6 mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{t("aboutUs")}</h2>
      </div>
      <div
        className="relative w-full max-w-screen-lg h-[500px] mx-auto flex items-center justify-center"
        style={{ touchAction: "pan-y", overscrollBehavior: "none" }}
      >
        <ul className="relative w-full h-full p-0 m-0 list-none">
          {cards.map((card, idx) => {
            const pos = (idx - currentIndex + total) % total;
            return (
              <SwipeCard key={card.id} card={card} pos={pos} total={total} onSwipe={handleSwipe} />
            );
          })}
        </ul>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {cards.map((_, idx) => (
          <span
            key={idx}
            onClick={() => jumpTo(idx)}
            className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-200 ${
              idx === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </section>
  );
}

const COLORS = [
  { bg: "bg-white", text: "text-black" },
  { bg: "bg-black", text: "text-white" },
  { bg: "bg-white", text: "text-black" },
  { bg: "bg-black", text: "text-white" },
];
