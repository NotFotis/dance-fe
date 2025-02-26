"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import axios from "axios";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchSavedEvents(user.id);
    }
  }, [user]);

  const fetchSavedEvents = async (userId) => {
    try {
      const token = localStorage.getItem("token"); // Get auth token
      if (!userId || !token) {
        console.error("User ID or token missing");
        return;
      }

      const response = await axios.get(
        `${API_URL}/saved-events?filters[user][id][$eq]=${userId}&populate=event`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract and format the saved events properly
      const formattedEvents = response.data.data
        .filter((savedEvent) => savedEvent.event) // Ensure event is not null
        .map((savedEvent) => ({
          savedEventId: savedEvent.id, // ID of the saved-event entry (needed for deletion)
          eventId: savedEvent.event.id,
          title: savedEvent.event.Title || "No Title",
          date: savedEvent.event.Date ? new Date(savedEvent.event.Date).toLocaleDateString() : "No Date",
          time: savedEvent.event.Time || "No Time",
          location: savedEvent.event.Loaction || "No Location",
        }));

      setSavedEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching saved events:", error);
    }
  };

  // Handle Removing a Saved Event
  const removeSavedEvent = async (savedEventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Auth token missing");
        return;
      }

      await axios.delete(`${API_URL}/saved-events/${savedEventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the event from UI after successful deletion
      setSavedEvents(savedEvents.filter((event) => event.savedEventId !== savedEventId));
    } catch (error) {
      console.error("Error removing saved event:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return <div className="text-center text-white py-12 text-xl">Loading profile...</div>;
  }

  return (
    <div className="bg-gradient min-h-screen flex flex-col items-center">
      <Navbar />
      <div className="max-w-4xl w-full bg-black rounded-lg shadow-lg p-8 text-white mt-20">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-4xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-gray-500 mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Saved Events Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Saved Events</h3>
          {savedEvents.length === 0 ? (
            <p className="text-gray-400">You have no saved events.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedEvents.map((event) => (
                <div key={event.savedEventId} className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col">
                  <h4 className="text-lg font-bold">{event.title}</h4>
                  <p className="text-gray-400">📅 {event.date} | 🕒 {event.time}</p>
                  <p className="text-gray-400">📍 {event.location}</p>
                  <a
                    href={`/events/${event.eventId}`}
                    className="text-blue-400 mt-2 block hover:underline"
                  >
                    View Details →
                  </a>

                  {/* Remove Saved Event Button */}
                  <button
                    onClick={() => removeSavedEvent(event.savedEventId)}
                    className="mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
                  >
                    Remove from Saved
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
