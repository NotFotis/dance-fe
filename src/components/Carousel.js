"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]); // Track saved events
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_API_URL}/events?populate=*`);
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Load saved events from Strapi for the logged-in user
    const fetchSavedEvents = async () => {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      if (!userId) return;

      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_API_URL}/saved-events?filters[user][id][$eq]=${userId}&populate[event]`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const savedIds = response.data.data.map((saved) => saved.event.id);
        setSavedEvents(savedIds);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };

    fetchSavedEvents();
  }, []);

  // Toggle save event
  const handleSaveEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!userId) {
      alert("You must be logged in to save events!");
      return;
    }

    try {
      if (savedEvents.includes(eventId)) {
        // Remove event from saved events
        await axios.delete(`${NEXT_PUBLIC_API_URL}/saved-events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedEvents(savedEvents.filter((id) => id !== eventId));
      } else {
        // Save new event
        await axios.post(
          `${NEXT_PUBLIC_API_URL}/saved-events`,
          { data: { user: userId, event: eventId } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSavedEvents([...savedEvents, eventId]);
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="carousel-container w-full max-w-7xl mx-auto px-6 py-12">
      <Slider {...settings}>
        {events.length > 0 ? (
          events.map((event) => {
            const eventImage = event.Image?.[0]?.formats?.medium?.url || "";
            const isSaved = savedEvents.includes(event.id); // Check if event is saved

            return (
              <div
                key={event.id}
                className="relative flex flex-col justify-end bg-black text-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 w-[300px] h-[450px]"
                onClick={() => router.push(`/events/${event.documentId}`)} // Redirect to event details
              >
                {eventImage && (
                  <img
                    src={`${NEXT_PUBLIC_URL}${eventImage}`}
                    alt={event.Title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="relative z-10 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold">{event.Title}</h3>
                  <p className="text-sm mt-2">📅 {new Date(event.Date).toLocaleDateString()} | 🕒 {event.Time}</p>
                  <p className="text-sm mt-1">📍 {event.Loaction || "Location not specified"}</p>

                  {/* ⭐ Save Event Button */}
                  <button
                    className={`absolute top-4 right-4 text-2xl ${
                      isSaved ? "text-yellow-400" : "text-gray-400"
                    } hover:text-yellow-300 transition`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event redirection
                      handleSaveEvent(event.id);
                    }}
                  >
                    ★
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-white">Loading events...</div>
        )}
      </Slider>
    </div>
  );
};

export default Carousel;
