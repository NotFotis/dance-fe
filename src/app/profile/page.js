"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import axios from "axios";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi"; // Trash bin icon

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const locales = { "en-US": require("date-fns/locale/en-US") };
  const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

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

  const fetchSavedEvents = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      const response = await axios.get(
        `${API_URL}/saved-events?filters[user][id][$eq]=${userId}&populate=event`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formattedEvents = response.data.data
        .filter((savedEvent) => savedEvent.event)
        .map((savedEvent) => ({
          savedEventId: savedEvent.id,
          eventId: savedEvent.event.id,
          title: savedEvent.event.Title || "No Title",
          start: savedEvent.event.Date ? new Date(savedEvent.event.Date) : new Date(),
          end: savedEvent.event.Date ? new Date(savedEvent.event.Date) : new Date(),
          location: savedEvent.event.Loaction || "No Location",
          documentId: savedEvent.event.documentId,
          description: savedEvent.event.Description || "No Description",
        }));

      setSavedEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching saved events:", error);
    }
  };

  const removeSavedEvent = async (savedEventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`${API_URL}/saved-events/${savedEventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedEvents(savedEvents.filter((event) => event.savedEventId !== savedEventId));
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error removing saved event:", error);
    }
  };

  return (
    <div className="bg-gradient min-h-screen flex flex-col items-center px-4 sm:px-0">
      <Navbar />
      
      {/* Profile Container with improved mobile spacing */}
      <div className="max-w-5xl w-full bg-black rounded-3xl shadow-lg p-6 sm:p-8 text-white mt-24 sm:mt-24">
        
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-800 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold">{user?.username}</h2>
            <p className="text-gray-400 text-sm sm:text-base">{user?.email}</p>
            <p className="text-gray-500 text-sm sm:text-base mt-1">
              Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </motion.div>

        {/* Calendar View */}
        <div className="mt-10">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">📅 My Calendar</h3>
          <div className="bg-black p-4 sm:p-6 rounded-xl shadow-lg">
            <Calendar
              localizer={localizer}
              events={savedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{
                height: 400,
                borderRadius: "15px",
                fontSize: "12px",
              }}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              defaultView={Views.MONTH}
              selectable
              onSelectEvent={(event) => setSelectedEvent(event)}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: "#06402B", 
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "5px",
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-gray-900 text-white p-6 sm:p-8 rounded-xl shadow-xl w-[90%] sm:w-[400px] max-w-lg"
            >
              <h3 className="text-lg sm:text-xl font-bold">{selectedEvent.title}</h3>
              <p className="text-gray-300 mt-2">📅 {selectedEvent.start.toDateString()}</p>
              <p className="text-gray-300">📍 {selectedEvent.location}</p>
              <p className="text-gray-400 mt-2">{selectedEvent.description}</p>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
                {/* Remove Event Button */}
                <button
                  onClick={() => removeSavedEvent(selectedEvent.savedEventId)}
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
                >
                  <FiTrash2 className="mr-2 text-lg" /> Remove Event
                </button>

                {/* View More Details Button */}
                <button
                  onClick={() => router.push(`/events/${selectedEvent.documentId}`)}
                  className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  View More →
                </button>
              </div>

              {/* Close Modal Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-4 w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
