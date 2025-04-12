"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Import Swiper styles
import "swiper/css";
// Import the modal component (ensure you have this component implemented)
import EventDetailsModal from "./modals/EventDetailsModal";

export default function Carousel() {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const router = useRouter();
  const sliderRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const t = useTranslations("carousel");

  // Fetch events data
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

  // Fetch saved events data
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

  const openModal = (documentId) => {
    setSelectedEventId(documentId);
  };

  return (
    <div className="relative bg-transparent mb-8">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header & Custom Navigation Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide mb-4 md:mb-0">
            {t("title")}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => sliderRef.current?.slidePrev()}
              className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => sliderRef.current?.slideNext()}
              className="py-2 px-2 border border-white text-white rounded-full uppercase tracking-wider font-medium hover:bg-white hover:text-black transition"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => router.push("/calendar")}
              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium hover:bg-white hover:text-black transition rounded"
            >
              {t("calendar")}
            </button>
          </div>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          onSwiper={(swiper) => (sliderRef.current = swiper)}
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          speed={600}
          autoplay={{ delay: 3500, disableOnInteraction: true }}
          breakpoints={{
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {events.length > 0 ? (
            events.map((event) => {
              const eventImage =
                event.Image?.[0]?.formats?.medium?.url ||
                event.Image?.[0]?.url ||
                "";
              const isSaved = savedEvents.includes(event.id);
              return (
                <SwiperSlide key={event.id}>
                  <div
                    className="relative group rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform transform hover:scale-105 mx-0 md:mx-8 w-full h-[500px]"
                    onClick={() => openModal(event.documentId)}
                  >
                    <button
                      className={`absolute top-3 right-3 text-xl ${
                        isSaved ? "text-yellow-400" : "text-gray-300"
                      } hover:text-yellow-300 transition z-20`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEvent(event.id);
                      }}
                    >
                      ★
                    </button>
                    <div className="flex flex-col h-full">
                      <div className="h-[66%] relative">
                        {eventImage && (
                          <img
                            src={`${URL}${eventImage}`}
                            alt={event.Title}
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                        )}
                      </div>
                      <div className="h-[34%] bg-black px-4 py-2 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white truncate">
                          {event.Title}
                        </h3>
                        <p className="text-gray-300 text-sm mt-1">
                          📅{" "}
                          {new Date(event.Date).toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          | 🕒 {event.Time ? event.Time.split(".")[0] : ""}
                        </p>
                        <p className="text-2sm mt-1 text-gray-300">
                          📍 {event.Loaction || t("noLocation")}
                        </p>
                        <div className="mt-2 flex space-x-3 text-2sm">
                          {event.Desc && (
                            <button
                              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded-3xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(event.documentId);
                              }}
                            >
                              {t("info")}
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
                              {t("buyTickets")}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })
          ) : (
            <SwiperSlide>
              <div className="w-full text-center text-white text-xl">
                {t("loadingEvents")}
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Render the event modal if an event is selected */}
      {selectedEventId && (
        <EventDetailsModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
}
