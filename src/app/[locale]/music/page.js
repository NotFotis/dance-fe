"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/NavBar";
import { useTranslations, useLocale } from "next-intl";

const MusicPage = () => {
  const router = useRouter();
  const t = useTranslations("music");
  const locale = useLocale();

  // Adjust the locale for the API and date formatting: if locale is "el", use "el-GR"
  const apiLocale = locale === "el" ? "el-GR" : locale;

  const [musicItems, setMusicItems] = useState([]);
  const [genres, setGenres] = useState([]); // state for genres from API
  const [selectedMonth, setSelectedMonth] = useState(t("all"));
  const [selectedGenre, setSelectedGenre] = useState(t("all"));
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  // Month options array (localized)
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

  // Featured Spotify Playlists
  const featuredPlaylists = [
    {
      name: "Top Hits",
      embedUrl:
        "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    },
    {
      name: "Chill Vibes",
      embedUrl:
        "https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6",
    },
    {
      name: "New Music Friday",
      embedUrl:
        "https://open.spotify.com/embed/playlist/37i9dQZF1DX4JAvHpjipBk",
    },
  ];

  // Fetch music items from API with locale query parameter
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/musics?populate=*&locale=${apiLocale}`
        );
        // Sort music items chronologically by release date
        const sortedMusic = response.data.data.sort(
          (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
        );
        setMusicItems(sortedMusic);
      } catch (error) {
        console.error("Error fetching music:", error);
      }
    };
    fetchMusic();
  }, [API_URL, apiLocale]);

  // Fetch genres from API with locale query parameter
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/Music-Genres?locale=${apiLocale}`
        );
        // Assuming genres returned have a "name" property.
        setGenres(response.data.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [API_URL, apiLocale]);

  // Create the genre options array with localized "All" as the default option
  const genreOptions = [t("all"), ...genres.map((genre) => genre.name)];

  // Filter music items based on selected month and genre
  const filteredMusic = musicItems.filter((music) => {
    const musicDate = new Date(music.releaseDate);
    const musicMonth = musicDate.toLocaleString("default", { month: "long" });
    const monthMatch = selectedMonth === t("all") || musicMonth === selectedMonth;
    const genreMatch =
      selectedGenre === t("all") ||
      (Array.isArray(music.music_genres) &&
        music.music_genres.some((genre) => genre.name === selectedGenre));
    return monthMatch && genreMatch;
  });

  // Group filtered music items by release month and year using localized dates
  const groupedMusic = filteredMusic.reduce((groups, music) => {
    const dateObj = new Date(music.releaseDate);
    const dateKey = dateObj.toLocaleDateString(apiLocale, {
      month: "long",
      year: "numeric",
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(music);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 text-lg">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-40">
        <h1 className="text-5xl font-extrabold mb-8 text-center uppercase tracking-widest">
          {t("title")}
        </h1>
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:justify-center items-center mb-12 space-y-4 md:space-y-0 md:space-x-8">
          <div className="flex flex-col">
            <label className="mb-2 uppercase tracking-wide text-sm">
              {t("filterMonth")}
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
              {t("filterGenre")}
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

        {/* Featured Spotify Playlists Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
            {t("featuredPlaylistsTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPlaylists.map((playlist, index) => (
              <div key={index} className="w-full h-96">
                <iframe
                  src={playlist.embedUrl}
                  width="100%"
                  height="100%"
                  allow="encrypted-media"
                  title={playlist.name}
                ></iframe>
              </div>
            ))}
          </div>
        </section>

        {/* Grouped Music Releases */}
        {Object.keys(groupedMusic).length === 0 ? (
          <div className="text-center text-xl">{t("noMusicFound")}</div>
        ) : (
          Object.keys(groupedMusic).map((dateKey) => (
            <div key={dateKey} className="mb-12">
              <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">
                {dateKey}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {groupedMusic[dateKey].map((music) => {
                  const musicImage =
                    music.coverArt?.formats?.medium?.url ||
                    music.coverArt?.url ||
                    "";
                  const artistNames =
                    music.artists && music.artists.length > 0
                      ? music.artists.map((artist) => artist.Name).join(", ")
                      : "";
                  return (
                    <div
                      key={music.id}
                      className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => router.push(`/music/${music.documentId}`)}
                    >
                      {musicImage && (
                        <img
                          src={`${URL}${musicImage}`}
                          alt={music.Title}
                          className="w-full h-56 object-cover"
                        />
                      )}
                      <div className="p-4 bg-black bg-opacity-75">
                        <h3 className="text-2xl font-bold">{music.Title}</h3>
                        {artistNames && (
                          <p className="text-sm mt-1">
                            {t("artist")}: {artistNames}
                          </p>
                        )}
                        <div className="mt-4 flex space-x-4">
                          {music.description &&
                            music.description.length > 0 && (
                              <button
                                className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/music/${music.documentId}`);
                                }}
                              >
                                {t("info")}
                              </button>
                            )}
                          {music.listenUrl && (
                            <button
                              className="py-2 px-4 border border-white text-white uppercase tracking-wider font-medium text-sm hover:bg-white hover:text-black transition rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(music.listenUrl, "_blank");
                              }}
                            >
                              {t("listen")}
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

export default MusicPage;
