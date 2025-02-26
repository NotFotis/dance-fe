"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/NavBar";
import parse from "html-react-parser";


const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:1338/api/events/${id}?populate=*`);
        setEvent(response.data.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="text-center text-white py-12 text-2xl">Loading event details...</div>;
  }

  if (!event) {
    return <div className="text-center text-red-500 py-12 text-2xl">Event not found</div>;
  }

  const eventImage = event.Image?.[0]?.formats?.large?.url || "";
  const googleMapsUrl = event.Loaction ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.Loaction)}` : "#";
  const transform = (node) => {
    if (node.name === "oembed" && node.attribs && node.attribs.url) {
      let { url } = node.attribs;
      // Check if the URL is from Spotify and isn't already an embed URL
      if (url.includes("open.spotify.com") && !url.includes("/embed/")) {
        url = url.replace("open.spotify.com", "open.spotify.com/embed");
      }
      return (
        <iframe
          src={url}
          width="100%"
          height="400"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded media"
        />
      );
    }
  };
  
  const formattedDesc = event.Desc;  
  return (
    <div className="bg-black min-h-screen flex flex-col items-center relative text-white">
      <Navbar />
      <div className="w-full max-w-6xl px-6 mt-20">
        {/* Header Image */}
        {eventImage && (
          <div className="w-full h-[500px] mb-12">
            <img
              src={`http://localhost:1338${eventImage}`}
              alt={event.Title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Event Title */}
        <h1 className="text-5xl font-bold mb-6 text-center md:text-left">{event.Title}</h1>

        {/* Date & Location */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 text-lg">
          <p className="text-gray-400">📅 {new Date(event.Date).toLocaleDateString()} | 🕒 {event.Time}</p>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:underline mt-2 md:mt-0"
          >
            📍 {event.Loaction || "Location not specified"}
          </a>
        </div>

        {/* Ticket Purchase Button */}
        {event.tickets && (
          <div className="my-6">
            <a
              href={event.tickets}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              🎟 Buy Tickets
            </a>
          </div>
        )}

        {/* Event Description - Supports CKEditor Rich Text */}
        <div className="prose prose-lg text-gray-300 leading-relaxed max-w-none">
    {parse(formattedDesc, { replace: transform })}
  </div>

      </div>
    </div>
  );
};

export default EventDetails;
