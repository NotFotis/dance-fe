"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import EventDetailsModal from "@/components/modals/EventDetailsModal"; // Ensure this exists

const CalendarPage = () => {
  const t = useTranslations();
  const router = useRouter();

  // State for events and genres fetched from API.
  const [events, setEvents] = useState([]);
  const [genres, setGenres] = useState([]);

  // Determine if screen is mobile.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // For list view: filter by month & genre.
  // Set default month to current month (localized long name).
  const currentMonthName = new Date().toLocaleString("default", { month: "long" });
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedGenre, setSelectedGenre] = useState(t("all"));

  // Toggle view state: "list" or "calendar".
  // On mobile, force "list", on desktop default to "calendar".
  const [view, setView] = useState("list");
  useEffect(() => {
    if (isMobile) {
      setView("list");
    } else {
      setView("calendar");
    }
  }, [isMobile]);

  // For calendar view navigation:
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());

  // Localized month names array for list view filters.
  const months = [
    t("all"),
    t("january"),
    t("february"),
    t("march"),
    t("april"),
    t("may"),
    t("june"),
    t("july"),
    t("august"),
    t("september"),
    t("october"),
    t("november"),
    t("december"),
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  // For opening the event modal.
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Fetch events and sort them chronologically.
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events?populate=*`);
        // Sort events in ascending order (earliest first)
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

  // Fetch genres from API.
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${API_URL}/Music-Genres`);
        setGenres(response.data.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [API_URL]);

  /* ------------------ List View Logic ------------------ */
  // Filter out events whose date has already passed (keep today or future).
  const futureEvents = events.filter(
    (event) => new Date(event.Date) >= new Date(new Date().toDateString())
  );

  // For list view, filter events based on selected month & genre.
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.Date);
    const eventMonth = eventDate.toLocaleString("default", { month: "long" });
    const monthMatch = selectedMonth === t("all") || eventMonth === selectedMonth;
    const genreMatch =
      selectedGenre === t("all") ||
      (Array.isArray(event.music_genres) &&
        event.music_genres.some((genre) => genre.name === selectedGenre));
    return monthMatch && genreMatch;
  });

  // Group the events by date (list view).
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

  /* ------------------ Calendar View Logic ------------------ */
  // Filter events for the calendar view: only future events in the displayed month/year + genre filter.
  const calendarFilteredEvents = events.filter((event) => {
    const eventDate = new Date(event.Date);
    const matchMonthYear =
      eventDate.getFullYear() === calendarYear && eventDate.getMonth() === calendarMonth;
    const genreMatch =
      selectedGenre === t("all") ||
      (Array.isArray(event.music_genres) &&
        event.music_genres.some((genre) => genre.name === selectedGenre));
    return matchMonthYear && genreMatch;
  });

  // Group calendar events by day of the month.
  const eventsByDay = {};
  calendarFilteredEvents.forEach((event) => {
    const d = new Date(event.Date);
    const day = d.getDate();
    if (!eventsByDay[day]) {
      eventsByDay[day] = [];
    }
    eventsByDay[day].push(event);
  });

  // Generate a calendar grid for the current calendar month.
  const generateCalendarGrid = () => {
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells = [];
    // Fill empty cells before the first.
    for (let i = 0; i < startingDay; i++) {
      cells.push(null);
    }
    // Fill cells with day numbers.
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }
    // Fill trailing empty cells until complete grid (multiple of 7).
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    // Chunk cells into weeks (arrays of 7).
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  };
  const weeks = generateCalendarGrid();

  // Handlers to navigate between months in calendar view.
  const goToPreviousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };
  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Toggle change handler for view switch.
  const toggleView = (e) => {
    setView(e.target.checked ? "calendar" : "list");
  };

  return (
    <div className="bg-black min-h-screen text-white items-center px-6">
      <Navbar brandName="dancecalendar" />
      <h1 className="text-6xl font-bold  text-center py-36">{t("title")}</h1>
      {/* On desktop, display toggle switch; on mobile, force list view */}
      {!isMobile && (
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center space-x-2">
          <span className={`text-white ${view === "list" ? "font-bold" : "opacity-70"}`}>
            {t("listView")}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={view === "calendar"}
              onChange={toggleView}
            />
            <span className="slider round"></span>
          </label>
          <span className={`text-white ${view === "calendar" ? "font-bold" : "opacity-70"}`}>
            {t("calendarView")}
          </span>
        </div>
      )}

      {view === "list" && (
        // ------------------ List View ------------------
        <div className="max-w-7xl mx-auto py-12 px-4 mt-10">
          {/* List View Filters */}
          <div className="flex flex-col md:flex-row md:justify-center items-center mb-12 space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col">
              <label className="mb-2 uppercase tracking-wide text-sm">
                {t("filterMonth")}
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="py-2 px-4 bg-black border border-gray-300 rounded text-white uppercase tracking-wider focus:outline-none"
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
                {t("filterGenre")}
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="py-2 px-4 bg-black border border-gray-300 rounded text-white uppercase tracking-wider focus:outline-none"
              >
                {[t("all"), ...genres.map((genre) => genre.name)].map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render Grouped Events */}
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center text-xl">{t("noEvents")}</div>
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
                        className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105"
                        onClick={() => setSelectedEventId(event.documentId)}
                      >
                        {eventImage && (
                          <img
                            src={`${URL}${eventImage}`}
                            alt={event.Title}
                            className="w-full h-56 object-cover"
                          />
                        )}
                        <div className="p-4 bg-black bg-opacity-60">
                          <h3 className="text-2xl font-bold">{event.Title}</h3>
                          <p className="text-xs mt-1">
                            {t("time")}: {event.Time.split(".")[0]}
                          </p>
                          <p className="text-xs mt-1">
                            {t("location")}: {event.Loaction || t("noLocation")}
                          </p>
                          <div className="mt-4 flex space-x-4">
                            {event.Desc && (
                              <button
                                className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-xs hover:bg-white hover:text-black transition rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEventId(event.documentId);
                                }}
                              >
                                {t("info")}
                              </button>
                            )}
                            {event.tickets && (
                              <button
                                className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-xs hover:bg-white hover:text-black transition rounded"
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
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {view === "calendar" && !isMobile && (
        // ------------------ Calendar View (Desktop only) ------------------
        <div className="max-w-7xl mx-auto py-12 px-4">
          {/* Calendar Navigation Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={goToPreviousMonth}
              className="py-2 px-4 rounded-full border border-white text-white uppercase tracking-wider hover:bg-white hover:text-black transition"
            >
              &lt;
            </button>
            <h2 className="text-3xl font-bold">
              {new Date(calendarYear, calendarMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="py-2 px-4 rounded-full border border-white text-white uppercase tracking-wider hover:bg-white hover:text-black transition"
            >
              &gt;
            </button>
          </div>
          {/* Genre Filter for Calendar View */}
          <div className="flex justify-end mb-4">
            <div className="flex flex-col">
              <label className="mb-2 uppercase tracking-wide text-sm">
                {t("filterGenre")}
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="py-2 px-4 bg-black border border-gray-300 rounded text-white uppercase tracking-wider focus:outline-none"
              >
                {[t("all"), ...genres.map((genre) => genre.name)].map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Calendar Grid Header (Weekdays) */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-bold border-b border-gray-700 pb-2">
                {day}
              </div>
            ))}
          </div>
          {/* Calendar Grid */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2 mt-2">
              {week.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="min-h-[250px] border border-gray-700 p-2 relative"
                >
                  {cell && (
                    <>
                      <div className="absolute top-2 left-2 text-sm font-bold">
                        {cell}
                      </div>
                      <div className="mt-6 space-y-1">
                        {eventsByDay[cell] &&
                          eventsByDay[cell].map((event) => (
                            <div
                              key={event.id}
                              className="bg-gray-800 text-xs p-1 rounded cursor-pointer hover:bg-gray-700"
                              onClick={() => setSelectedEventId(event.documentId)}
                            >
                              {event.Title}
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <Footer />

      {/* Toggle Switch CSS Styling */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 70px;
          height: 40px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background: #333;
          border-radius: 20px;
          transition: 0.4s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 36px;
          width: 36px;
          left: 2px;
          bottom: 2px;
          background: #fff;
          border-radius: 50%;
          transition: 0.4s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        input:checked + .slider {
          background: #222;
        }
        input:checked + .slider:before {
          transform: translateX(30px);
        }
      `}</style>

      {/* Event Details Modal */}
      {selectedEventId && (
        <EventDetailsModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  );
};

export default CalendarPage;
