"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';

const Panel = ({ title, text, zIndex, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.5 });

  // Determine background and text colors based on panel index
  const isBlack = ((index + 1) % 2 === 0);
  const bgClass = isBlack ? "bg-black" : "bg-white";
  const titleTextColor = isBlack ? "text-white" : "text-gray-800";
  const bodyTextColor = isBlack ? "text-gray-300" : "text-gray-600";

  // Hover text colors: invert the original colors
  const hoverTitleTextClass = isBlack ? "group-hover:text-black" : "group-hover:text-white";
  const hoverBodyTextClass = isBlack ? "group-hover:text-black" : "group-hover:text-white";

  // Use white circle on black panels, and black circle on white panels
  const circleColorClass = isBlack ? "bg-white" : "bg-black";

  // Animation variants for the expanding circle
  const circleVariants = {
    rest: { scale: 0 },
    hover: { scale: 20 },
  };

  return (
    <motion.div
      ref={ref}
      style={{ zIndex }}
      className={`group sticky top-0 min-h-[50vh] flex flex-col justify-center items-center ${bgClass} rounded-2xl relative overflow-hidden`}
      initial="rest"
      whileHover="hover"
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Expanding circle on hover */}
      <motion.div
        variants={circleVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`absolute ${circleColorClass} rounded-full z-0`}
        style={{
          width: 50,
          height: 50,
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
      />
      <h2 className={`text-3xl font-bold mb-4 ${titleTextColor} ${hoverTitleTextClass} relative z-10`}>
        {title}
      </h2>
      <p className={`text-xl text-center max-w-2xl px-4 ${bodyTextColor} ${hoverBodyTextClass} font-body relative z-10`}>
        {text}
      </p>
    </motion.div>
  );
};

const ScrollPanels = () => {
  const [panels, setPanels] = useState([]);
  const [documentTitle, setDocumentTitle] = useState("About");
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
        const docTitle = aboutData.title || "About";
        setDocumentTitle(docTitle);
        const blocks = aboutData.blocks || [];
        // Map each block into the structure needed for the Panel component
        const mappedPanels = blocks.map((block) => mapBlockToPanel(block, docTitle));
        setPanels(mappedPanels);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };
    fetchAbout();
  }, [API_URL]);

  return (
    <div>
      {/* Section Title using documentTitle from the API */}
      <div className="py-10 bg-transparent">
        <h1 className="text-4xl font-bold text-center text-white">
          {documentTitle}
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
