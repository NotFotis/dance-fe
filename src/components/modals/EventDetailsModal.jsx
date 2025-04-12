"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslations } from "next-intl";
import parse from "html-react-parser";
import { 
  FaFacebook, 
  FaInstagram, 
  FaSpotify, 
  FaSoundcloud, 
  FaTwitter 
} from "react-icons/fa";
import { SiBeatport } from "react-icons/si";

export default function EventDetailsModal({ eventId, onClose }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/events/${eventId}?&populate=artists.Socials&populate=Image`
        );
        // Assuming the response structure returns the event object in data.data
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId, API_URL]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50 p-4 text-white">
        {t("loading")}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50 p-4 text-red-500">
        {t("notFound")}
      </div>
    );
  }

  // Get event image URL (if available)
  const eventImage = event.Image?.[0]?.formats?.large?.url || "";
  // Build Google Maps URL using the event location (if available)
  const googleMapsUrl = event.Loaction
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        event.Loaction
      )}`
    : "#";

  // Helper function to render the event description safely using html-react-parser
  const renderDescription = () => {
    if (!event.description) return <p>{t("noDescription")}</p>;
    if (Array.isArray(event.description) && event.description.length > 0) {
      return event.description.map((block, index) => {
        if (block.type === "paragraph" && block.children) {
          const content = block.children.map((child) => child.text).join("");
          return (
            <p key={index} className="mb-4">
              {parse(content)}
            </p>
          );
        }
        return null;
      });
    }
    if (typeof event.description === "string") {
      return <div>{parse(event.description)}</div>;
    }
    return <div>{parse(JSON.stringify(event.description))}</div>;
  };

  return (
    // Overlay that covers the entire viewport; clicking it calls onClose.
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative bg-black text-white rounded-lg shadow-xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header with a round close button */}
        <div className="sticky top-0 z-50 flex justify-end bg-transparent">
          <button
            onClick={onClose}
            className="m-4 flex items-center justify-center w-12 h-12 rounded-full bg-black text-5xl text-white leading-none hover:bg-opacity-100"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Event image (if available) */}
        {eventImage && (
          <div className="w-full h-64 sm:h-full overflow-hidden">
            <img
              src={`${URL}${eventImage}`}
              alt={event.Title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event details */}
        <div className="py-6 px-4 sm:px-6 md:px-8 pb-8 text-center">
          <h2 className="text-5xl font-bold mb-6">{event.Title}</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 text-lg">
            <p className="text-gray-400">
              📅 {new Date(event.Date).toLocaleDateString()} | 🕒 {event.Time}
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
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

          {/* Event description */}
          <div className="prose prose-lg text-gray-300 leading-relaxed max-w-none text-xl mb-8">
            {renderDescription()}
          </div>

          {/* Lineup Section */}
          <div className="mt-12 text-left">
            <h3 className="text-3xl font-bold mb-4">{t("lineup")}</h3>
            {event.artists && event.artists.length > 0 ? (
              <ul className="text-xl text-gray-300">
                {event.artists.map((artist, index) => (
                  <li key={index} className="mb-2 flex items-center">
                    {artist.Name}
                    {artist.Socials && artist.Socials.length > 0 && (
                      <span className="ml-2 flex gap-2">
                        {artist.Socials.map((social, idx) => {
                          let icon;
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
    </div>
  );
}
