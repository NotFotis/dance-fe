"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

const ProfilePage = () => {
  const t = useTranslations("profile");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  const [user, setUser] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedArtists, setSavedArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  // Set default month to the current month (e.g., "August")
  const currentMonth = format(new Date(), "MMMM");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedGenre, setSelectedGenre] = useState(t("all"));

  // Localized months array (with "All" option as well)
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

  // Get user from localStorage or redirect to login.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  // Fetch saved events and saved artists when user is loaded.
  useEffect(() => {
    if (user) {
      fetchSavedEvents(user.id);
      fetchSavedArtists(user.id);
    }
  }, [user]);

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

  // Fetch saved events for the logged-in user.
  const fetchSavedEvents = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      // Populate all nested event details.
      const response = await axios.get(
        `${API_URL}/saved-events?filters[user][id][$eq]=${userId}&populate[event][populate]=*`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Extract the event from each saved event record.
      const eventsData = response.data.data
        .map((savedEvent) => savedEvent.event)
        .filter((event) => event);
      setSavedEvents(eventsData);
    } catch (error) {
      console.error("Error fetching saved events:", error);
    }
  };

  // Fetch saved artists for the logged-in user.
  const fetchSavedArtists = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      const response = await axios.get(
        // Populate both Socials and Image for the artist.
        `${API_URL}/saved-artists?filters[user][id][$eq]=${userId}&populate=artist.Socials&populate=artist.Image`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const formattedArtists = response.data.data.map((savedArtist) => ({
        savedArtistId: savedArtist.id,
        artistId: savedArtist.artist?.id,
        name: savedArtist.artist?.Name || t("unknownArtist"),
        socials:
          savedArtist.artist?.Socials?.map((social) => ({
            platform: social.platform,
            url: social.URL,
          })) || [],
        // Fetch the artist image similar to event image logic.
        avatarUrl:
          savedArtist.artist?.Image?.formats?.small?.url ||
          savedArtist.artist?.Image?.url ||
          null,
      }));
      setSavedArtists(formattedArtists);
    } catch (error) {
      console.error("Error fetching saved artists:", error);
    }
  };

  // Filter events based on selected month and genre.
  const filteredEvents = savedEvents.filter((event) => {
    const eventDate = new Date(event.Date);
    const eventMonth = eventDate.toLocaleString("default", { month: "long" });
    const monthMatch = selectedMonth === t("all") || eventMonth === selectedMonth;
    const genreMatch =
      selectedGenre === t("all") ||
      (Array.isArray(event.music_genres) &&
        event.music_genres.some((genre) => genre.name === selectedGenre));
    return monthMatch && genreMatch;
  });

  // Group filtered events by month (e.g., "August 2023").
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const dateObj = new Date(event.Date);
    const monthKey = dateObj.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(event);
    return groups;
  }, {});

  // Create genre options array with localized "All" as the default.
  const genreOptions = [t("all"), ...genres.map((genre) => genre.name)];

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 text-lg">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-40">
        {/* Saved Events Section */}
        <h1 className="text-3xl font-extrabold mb-6 text-center uppercase tracking-widest">
          {t("savedEventsTitle")}
        </h1>
        <div className="flex flex-col md:flex-row md:justify-center items-center mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex flex-col">
            <label className="mb-1 uppercase tracking-wide text-sm">
              {t("filterMonth")}
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="py-1 px-3 bg-black border border-white rounded text-white uppercase tracking-wide"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 uppercase tracking-wide text-sm">
              {t("filterGenre")}
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="py-1 px-3 bg-black border border-white rounded text-white uppercase tracking-wide"
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Saved Events by Month */}
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center text-lg">{t("noEvents")}</div>
        ) : (
          Object.keys(groupedEvents).map((monthKey) => (
            <div key={monthKey} className="mb-10">
              <h2 className="text-xl font-bold mb-3 border-b border-gray-700 pb-1">
                {monthKey}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groupedEvents[monthKey].map((event) => {
                  const eventImage =
                    event.Image?.[0]?.formats?.medium?.url ||
                    event.Image?.[0]?.url ||
                    "";
                  return (
                    <div
                      key={event.id}
                      className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => router.push(`/events/${event.documentId}`)}
                    >
                      {eventImage && (
                        <img
                          src={`${URL}${eventImage}`}
                          alt={event.Title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-3 bg-black bg-opacity-75">
                        <h3 className="text-lg font-bold">{event.Title}</h3>
                        <p className="text-xs mt-1">
                          {t("time")}: {format(new Date(event.Date), "eee, p")}
                        </p>
                        <p className="text-xs mt-1">
                          {t("location")}: {event.Loaction || t("notSpecified")}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          {event.Desc && (
                            <button
                              className="py-1 px-2 border border-white text-white uppercase tracking-wide text-xs hover:bg-white hover:text-black transition rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/events/${event.documentId}`);
                              }}
                            >
                              {t("info")}
                            </button>
                          )}
                          {event.tickets && (
                            <button
                              className="py-1 px-2 border border-white text-white uppercase tracking-wide text-xs hover:bg-white hover:text-black transition rounded"
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

        {/* Saved Artists Section */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest">
            {t("savedArtists")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedArtists.length > 0 ? (
              savedArtists.map((artist) => (
                <div
                  key={artist.savedArtistId}
                  className="bg-black p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-800 transition"
                  onClick={() => router.push(`/artists/${artist.artistId}`)}
                >
                  <div className="w-full flex justify-center mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800">
                      {artist.avatarUrl ? (
                        <img
                          src={`${URL}${artist.avatarUrl}`}
                          alt={artist.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-white">
                          {artist.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center">{artist.name}</h3>
                </div>
              ))
            ) : (
              <p className="text-center text-xl">{t("noSavedArtists")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
