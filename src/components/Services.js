"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import * as FaIcons from "react-icons/fa"; // Import all Font Awesome icons
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

// Fallback icon if none is found
const FallbackIcon = FaIcons.FaCode;

// Helper function for dynamic icon mapping
const getIconComponent = (iconKey) => {
  if (!iconKey) return FallbackIcon;

  let iconName;
  // If the key starts with "Fa" (case-sensitive), assume it's already the proper component name.
  if (iconKey.startsWith("Fa")) {
    iconName = iconKey;
  } else if (iconKey.startsWith("fa")) {
    // Convert first letter to uppercase
    iconName = "F" + iconKey.slice(1);
  } else {
    // Otherwise, assume it is a slug (e.g., "mobile-alt") and convert it.
    iconName =
      "Fa" +
      iconKey
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
  }
  return FaIcons[iconName] || FallbackIcon;
};

// Helper to convert a rich text description array into plain text
const parseDescription = (descriptionArray) => {
  if (!Array.isArray(descriptionArray)) return "";
  return descriptionArray
    .map((block) => {
      if (block.type === "paragraph" && block.children) {
        return block.children.map((child) => child.text).join("");
      }
      return "";
    })
    .join(" ");
};

const circleVariants = {
  rest: { scale: 0 },
  hover: { scale: 20 }, // Adjust this value if needed to fully cover the card
};

export default function OurServices() {
  const [services, setServices] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const t = useTranslations("ourServices");
  const locale = useLocale();
  const apiLocale = locale === 'el' ? 'el-GR' : locale;
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/services?locale=${apiLocale}`);
        // The response structure: { data: { data: [ service, ... ] } }
        setServices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [API_URL]);

  return (
    <section className="relative bg-transparent">
      <div className="container mx-auto px-6 relative z-10 py-16 mt-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 md:mb-0">
            {t("title")}
          </h2>
          <div className="flex items-center space-x-4">
          <Link
            href="/advertise"
            className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
          >
            {t("advertise")}
          </Link>
          </div>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <motion.div
                key={service.id}
                className="relative group overflow-hidden bg-black p-8 rounded-lg shadow-lg cursor-pointer border border-white transition-colors duration-300 group-hover:border-black"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                {/* Expanding white circle */}
                <motion.div
                  variants={circleVariants}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute bg-white rounded-full z-0"
                  style={{
                    width: 50,
                    height: 50,
                    top: "50%",
                    left: "50%",
                    x: "-50%",
                    y: "-50%",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center text-white transition-colors duration-300 group-hover:text-black">
                  <div className="text-4xl mb-4 group-hover:text-black">
                    <IconComponent />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-center group-hover:text-black">
                    {parseDescription(service.description)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
