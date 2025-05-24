"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function JourneySection() {
  const [journeyData, setJourneyData] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("journeySection");
  const locale = useLocale();
  const apiLocale = locale === 'el' ? 'el-GR' : locale;
  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        const response = await axios.get(`${API_URL}/our-journey?populate=image&populate=stats&locale=${apiLocale}`);
        // The journey data is in response.data.data
        setJourneyData(response.data.data);
      } catch (error) {
        console.error("Error fetching journey data:", error);
      }
    };

    fetchJourneyData();
  }, [API_URL]);

  if (!journeyData) {
    return <div className="text-white py-20 text-center">Loading...</div>;
  }

  // Destructure fields from the fetched data
  const { title, stats, image } = journeyData;
  // Choose the medium format if available, otherwise fallback to the base URL
  const imageUrl = image?.formats?.medium?.url || image?.url;

  return (
    <div className="relative bg-transparent text-white py-16 mt-20">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header with title on the left */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 md:mb-0">
            {title}
          </h2>
          {/* Optionally, add a button or additional element on the right here */}
        </div>

        {/* Two-column layout: Left column for stats, right column for image */}
        <div className="bg-black py-10 px-6 rounded-3xl flex flex-col md:flex-row items-stretch gap-12">
          {/* Left Column: Dynamic Stats */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <ul className="space-y-8">
              {stats?.map((stat) => (
                <li key={stat.id} className="flex flex-col">
                  <span className="text-4xl font-extrabold">{stat.value}</span>
                  <span className="text-lg font-semibold mt-1">{stat.text}</span>
                  <p className="text-gray-400 text-sm border-b">{stat.description}</p>
                </li>
              ))}
            </ul>
          </div>
          {/* Right Column: Image */}
          <div className="md:w-1/2 w-full h-full relative">
            {imageUrl && (
              <img
                src={`${imageUrl}`}
                alt={title}
                className="object-cover rounded-lg shadow-xl"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
