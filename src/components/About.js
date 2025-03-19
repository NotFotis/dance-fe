"use client";
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const panels = [
  {
    title: 'About dancetoday',
    text: `Idolverse is a dynamic, creative community that celebrates artistry,
           innovation, and collaboration. Discover a world where art meets technology,
           and creativity has no limits.`,
  },
  {
    title: 'Our Mission',
    text: `Our mission is to empower creators and fans alike by providing a platform
           that inspires innovation and nurtures talent. Join us in shaping the future
           of digital creativity.`,
  },
  {
    title: 'Join the Community',
    text: `Whether you're an artist, a fan, or a creative thinker, there's a place for you
           in Idolverse. Connect, collaborate, and create with like-minded individuals today.`,
  },
];

const Panel = ({ title, text, zIndex, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.5 });
  // Determine background and text colors based on panel index
  const bgClass = ((index + 1) % 2 === 0) ? "bg-black" : "bg-white";
  const titleTextColor = ((index + 1) % 2 === 0) ? "text-white" : "text-gray-800";
  const bodyTextColor = ((index + 1) % 2 === 0) ? "text-gray-300" : "text-gray-600";

  return (
    <motion.div
      ref={ref}
      style={{ zIndex }}
      className={`sticky top-0 min-h-[50vh] flex flex-col justify-center items-center ${bgClass} rounded-2xl`}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={`text-3xl font-bold mb-4 ${titleTextColor}`}>
        {title}
      </h2>
      <p className={`text-lg text-center max-w-2xl px-4 ${bodyTextColor}`}>
        {text}
      </p>
    </motion.div>
  );
};

const ScrollPanels = () => {
  return (
    <div>
      {/* Title for the entire section */}
      <div className="py-10 bg-transparent">
        <h1 className="text-4xl font-bold text-center text-white">
          Welcome to dancetoday
        </h1>
      </div>
      {/* Sticky Panels */}
      <div className="relative">
        {panels.map((panel, index) => (
          <Panel key={index} index={index} {...panel} zIndex={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default ScrollPanels;
