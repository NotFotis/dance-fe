"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import "tailwindcss/tailwind.css";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import Navbar from "@/components/NavBar";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    if (user) fetchSavedEvents(user.id);
  }, [user]);

  useEffect(() => {
    filterEventsByMonth(selectedMonth);
  }, [selectedMonth, savedEvents]);

  const fetchSavedEvents = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      const response = await axios.get(
        `${API_URL}/saved-events?filters[user][id][$eq]=${userId}&populate[event][populate][artists][populate]=Socials`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);

      const formattedEvents = response.data.data.map((savedEvent) => {
        const eventDate = savedEvent.event?.Date
          ? new Date(savedEvent.event.Date)
          : new Date();

        return {
          savedEventId: savedEvent.id,
          eventId: savedEvent.event?.id,
          title: savedEvent.event?.Title || "No Title",
          date: eventDate,
          location: savedEvent.event?.Loaction || "No Location",
          documentId: savedEvent.event?.documentId,
          artists: savedEvent.event?.artists?.map((artist) => ({
            name: artist.Name || "Unknown Artist",
            socials: artist.Socials?.map((social) => ({
              platform: social.platform,
              url: social.URL,
            })) || [],
          })) || [],
        };
      });

      setSavedEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching saved events:", error);
    }
  };

  const filterEventsByMonth = (month) => {
    if (month === "All") {
      setFilteredEvents(savedEvents); // Show all events if "All" is selected
    } else {
      const filtered = savedEvents.filter((event) =>
        format(event.date, "MMMM yyyy") === month
      );
      setFilteredEvents(filtered);
    }
    setVisibleEvents(6);
  };

  return (
    <div className="relative min-h-screen bg-gradient text-white flex flex-col items-center p-6">
      <Navbar />
      <div className="max-w-5xl w-full bg-black rounded-lg shadow-lg p-6 sm:p-8 text-white mt-16 sm:mt-24">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">{user?.username}</h2>
            <p className="text-gray-400 text-sm sm:text-base">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="w-full max-w-4xl flex justify-between items-center my-6">
        <select 
          className="bg-gray-700 text-white px-4 py-2 rounded-lg"
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="All">All</option>
          {[...new Set(savedEvents.map(event => format(event.date, "MMMM yyyy")))].map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* Events List */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.sort((a, b) => a.date - b.date).slice(0, visibleEvents).map((event) => (
          <motion.div 
            key={event.savedEventId} 
            className="bg-black p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-800 transition"
            onClick={() => router.push(`/events/${event.documentId}`)}
          >
            <h3 className="text-lg font-bold">{event.title}</h3>
            <p className="text-gray-300">📅 {format(event.date, "PPPP")}</p>
            <p className="text-gray-300">📍 {event.location}</p>
            <div className="mt-2">
              <h4 className="text-md font-semibold">Lineup:</h4>
              <ul className="text-gray-300 text-sm">
                {event.artists.length > 0 ? (
                  event.artists.map((performer, index) => (
                    <li key={index}>{performer.name}</li>
                  ))
                ) : (
                  <li>TBD</li>
                )}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleEvents < filteredEvents.length && (
        <button 
          className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition" 
          onClick={() => setVisibleEvents(visibleEvents + 6)}
        >
          Load More
        </button>
      )}
    </div>
  );
}
