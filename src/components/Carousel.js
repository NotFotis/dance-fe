"use client";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useRouter } from "next/navigation";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import "../css/slick-custom.css"

const Carousel = () => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const router = useRouter();
  const sliderRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events?populate=*`);
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [API_URL]);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("user"))?.id;
      if (!userId) return;
      try {
        const response = await axios.get(
          `${API_URL}/saved-events?filters[user][id][$eq]=${userId}&populate[event][populate][artists][populate]=Socials`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const savedIds = response.data.data.map((saved) => saved.event?.id);
        setSavedEvents(savedIds);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };
    fetchSavedEvents();
  }, [API_URL]);

  const handleSaveEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!userId) {
      alert("You must be logged in to save events!");
      return;
    }
    try {
      if (savedEvents.includes(eventId)) {
        await axios.delete(`${API_URL}/saved-events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedEvents(savedEvents.filter((id) => id !== eventId));
      } else {
        await axios.post(
          `${API_URL}/saved-events`,
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
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="relative min-h-screen bg-transparent py-12">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header with Title, Calendar, and Slider Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 md:mb-0">
            Events & Festivals
          </h2>
          <div className="flex items-center space-x-4">
          <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="py-1 px-3 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              &#8249;
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="py-1 px-3 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              &#8250;
            </button>
            <button
              onClick={() => router.push("/calendar")}
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              Calendar
            </button>

          </div>
        </div>

        {/* Slider */}
        <Slider ref={sliderRef} {...settings}>
          {events.length > 0 ? (
            events.map((event) => {
              const eventImage =
                event.Image?.[0]?.formats?.medium?.url ||
                event.Image?.[0]?.url ||
                "";
              const isSaved = savedEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="relative group flex flex-col justify-end rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform transform hover:scale-105 mx-8 w-[280px] h-[400px]"
                  onClick={() => router.push(`/events/${event.documentId}`)}
                >
                  {eventImage && (
                    <img
                      src={`${URL}${eventImage}`}
                      alt={event.Title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="relative z-10 p-4 bg-gradient-to-t from-black via-transparent to-transparent h-full flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
                      {event.Title}
                    </h3>
                    <p className="text-xs mt-1 text-gray-200 drop-shadow">
                      📅{" "}
                      {new Date(event.Date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      | 🕒 {event.Time.split(".")[0]}
                    </p>
                    <p className="text-xs mt-1 text-gray-200 drop-shadow">
                      📍 {event.Loaction || "Location not specified"}
                    </p>

                    {/* Save Event Button */}
                    <button
                      className={`absolute top-3 right-3 text-xl ${
                        isSaved ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-300 transition`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEvent(event.id);
                      }}
                    >
                      ★
                    </button>

                    {/* Conditional Action Buttons */}
                    <div className="mt-4 flex space-x-3">
                      {event.Desc && (
                        <button
                          className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded-3xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/events/${event.documentId}`);
                          }}
                        >
                          Info
                        </button>
                      )}
                      {event.tickets && (
                        <button
                          className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded-3xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(event.tickets, "_blank");
                          }}
                        >
                          Buy Tickets
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center text-white text-xl">
              Loading events...
            </div>
          )}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
