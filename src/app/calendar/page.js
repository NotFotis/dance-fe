"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../components/NavBar";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [genres, setGenres] = useState([]); // state for genres from API
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();

  // Month options array
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events?populate=*`);
        // Sort events chronologically
        const sortedEvents = response.data.data.sort(
          (a, b) => new Date(a.Date) - new Date(b.Date)
        );
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [API_URL]);

  // Fetch genres from API
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}/Music-Genres`);
        // Assuming the genres are returned directly with a "name" property.
        setGenres(response.data.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [API_URL]);

  // Create the genre options array with "All" as the default option
  const genreOptions = ["All", ...genres.map((genre) => genre.name)];

  // Filter events based on selected month and genre
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.Date);
    const eventMonth = eventDate.toLocaleString("default", { month: "long" });
    const monthMatch = selectedMonth === "All" || eventMonth === selectedMonth;
    const genreMatch =
      selectedGenre === "All" ||
      (Array.isArray(event.music_genres) &&
        event.music_genres.some((genre) => genre.name === selectedGenre));
    return monthMatch && genreMatch;
  });

  // Group filtered events by formatted date
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const dateObj = new Date(event.Date);
    const dateKey = dateObj.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-40">
        <h1 className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest">
          Events Calendar
        </h1>
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:justify-center items-center mb-12 space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-sm">
              Filter by Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="py-2 px-4 bg-black border border-white rounded text-white uppercase tracking-wider"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-sm">
              Filter by Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="py-2 px-4 bg-black border border-white rounded text-white uppercase tracking-wider"
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Events */}
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center text-xl">No events found.</div>
        ) : (
          Object.keys(groupedEvents).map((dateKey) => (
            <div key={dateKey} className="mb-12">
              <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
                {dateKey}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {groupedEvents[dateKey].map((event) => {
                  const eventImage =
                    event.Image?.[0]?.formats?.medium?.url ||
                    event.Image?.[0]?.url ||
                    "";
                  return (
                    <div
                      key={event.id}
                      className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => router.push(`/events/${event.documentId}`)}
                    >
                      {eventImage && (
                        <img
                          src={`${URL}${eventImage}`}
                          alt={event.Title}
                          className="w-full h-56 object-cover"
                        />
                      )}
                      <div className="p-4 bg-black bg-opacity-75">
                        <h3 className="text-xl font-bold">{event.Title}</h3>
                        <p className="text-sm mt-1">
                          Time: {event.Time.split(".")[0]}
                        </p>
                        <p className="text-sm mt-1">
                          Location: {event.Loaction || "Not specified"}
                        </p>
                        <div className="mt-4 flex space-x-4">
                          {event.Desc && (
                            <button
                              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded"
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
                              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded"
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
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
