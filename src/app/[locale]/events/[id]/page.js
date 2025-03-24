"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../../../components/NavBar";
import parse from "html-react-parser";
import { useTranslations } from "next-intl";
// Import the icons you need from React Icons
import { FaFacebook, FaInstagram, FaSpotify, FaSoundcloud, FaTwitter } from "react-icons/fa";
import { SiBeatport } from "react-icons/si";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  
  // Use translations from the "eventDetails" namespace.
  const t = useTranslations();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/events/${id}?&populate=artists.Socials&populate=Image`
        );
        console.log(response);
        // Extract the nested event data based on the provided response structure
        const eventData = response.data.data;
        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="text-center text-white py-12 text-2xl">
        {t("loading")}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center text-red-500 py-12 text-2xl">
        {t("notFound")}
      </div>
    );
  }

  const eventImage = event.Image?.[0]?.formats?.large?.url || "";
  const googleMapsUrl = event.Loaction
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        event.Loaction
      )}`
    : "#";

  return (
    <div className="bg-black min-h-screen flex flex-col items-center relative text-white mt-20">
      <Navbar />
      <div className="w-full max-w-6xl px-6 mt-20">
        {eventImage && (
          <div className="w-full h-full mb-12">
            <img
              src={`${URL}${eventImage}`}
              alt={event.Title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        <h1 className="text-5xl font-bold mb-6 text-center md:text-left">
          {event.Title}
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 text-lg">
          <p className="text-gray-400">
            📅 {new Date(event.Date).toLocaleDateString()} | 🕒 {event.Time}
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline mt-2 md:mt-0"
          >
            📍 {event.Loaction || t("noLocation")}
          </a>
        </div>

        {event.tickets && (
          <div className="my-6">
            <a
              href={event.tickets}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              🎟 {t("buyTickets")}
            </a>
          </div>
        )}

        {/* Render the description content from the API */}
        <div className="prose prose-lg text-gray-300 leading-relaxed max-w-none text-xl">
          {Array.isArray(event.description) && event.description.length > 0 ? (
            event.description.map((block, index) => {
              if (block.type === "paragraph" && Array.isArray(block.children)) {
                const combinedContent = block.children
                  .map((child) => child.text)
                  .join("");
                return (
                  <p key={index} className="mb-6">
                    {parse(combinedContent)}
                  </p>
                );
              }
              return null;
            })
          ) : (
            <p>{t("noDescription")}</p>
          )}
        </div>

        {/* Lineup Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">{t("lineup")}</h2>
          {event.artists && event.artists.length > 0 ? (
            <ul className="text-xl text-gray-300 ">
              {event.artists.map((artist, index) => (
                <li key={index} className="mb-2 flex items-center ">
                  {artist.Name}
                  {artist.Socials && artist.Socials.length > 0 && (
                    <span className="ml-2 flex gap-2 ">
                      {artist.Socials.map((social, idx) => {
                        let icon;
                        // Map the social platform to its corresponding icon
                        switch (social.platform.toLowerCase()) {
                          case "facebook":
                            icon = <FaFacebook size={24} />;
                            break;
                          case "instagram":
                            icon = <FaInstagram size={24} />;
                            break;
                          case "spotify":
                            icon = <FaSpotify size={24} />;
                            break;
                          case "beatport":
                            icon = <SiBeatport size={24} />;
                            break;
                          case "soundcloud":
                            icon = <FaSoundcloud size={24} />;
                            break;
                          case "x":
                            icon = <FaTwitter size={24} />;
                            break;
                          default:
                            icon = social.platform;
                        }
                        return (
                          <a
                            key={idx}
                            href={social.URL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {icon}
                          </a>
                        );
                      })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-lg">{t("noLineup")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
