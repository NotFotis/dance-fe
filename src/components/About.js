"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';

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
  const [panels, setPanels] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Helper function to map blocks to panel objects
  const mapBlockToPanel = (block, defaultTitle) => {
    if (block.__component === 'shared.quote') {
      return {
        title: block.title || defaultTitle || "Quote",
        text: block.body || ""
      };
    } else if (block.__component === 'shared.rich-text') {
      return {
        title: defaultTitle || "Details",
        text: block.body || ""
      };
    } else if (block.__component === 'shared.media') {
      // For media, you may want to create a dedicated component.
      return {
        title: "Media",
        text: "Media content is not displayed in this panel."
      };
    } else {
      return {
        title: defaultTitle || "Info",
        text: ""
      };
    }
  };

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // Fetch the about data with populate=*
        const response = await axios.get(`${API_URL}/about?populate=*`);
        const aboutData = response.data.data;
        // Extract document title and blocks array
        const documentTitle = aboutData.title || "About";
        const blocks = aboutData.blocks || [];
        // Map each block into the structure needed for the Panel component
        const mappedPanels = blocks.map((block) => mapBlockToPanel(block, documentTitle));
        setPanels(mappedPanels);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAbout();
  }, [API_URL]);

  return (
    <div>
      {/* Section Title (using the document title if available) */}
      <div className="py-10 bg-transparent">
        <h1 className="text-4xl font-bold text-center text-white">
          {"Welcome to dancetoday"}
        </h1>
      </div>
      {/* Sticky Panels */}
      <div className="relative">
        {panels.length > 0 ? (
          panels.map((panel, index) => (
            <Panel key={index} index={index} {...panel} zIndex={index + 1} />
          ))
        ) : (
          <p className="text-center text-white">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ScrollPanels;
