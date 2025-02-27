"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/NavBar";

export default function DanceNewsPage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new?populate=*`);
        const newsData = response.data.data;
        setNews(newsData);
        if (newsData.length > 0) {
          setFeaturedNews(newsData[0]);
          setFilteredNews(newsData);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (selectedGenre === "All") {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter((item) => item.genre === selectedGenre));
    }
  }, [selectedGenre, news]);

  return (
    <div className="bg-gradient min-h-screen text-white flex flex-col items-center">
      <Navbar />
      <div className="max-w-6xl w-full px-6 mt-20">
        {/* Genre Filter */}
        <div className="mb-6 flex justify-center">
          <select
            className="bg-gray-700 text-white px-4 py-2 rounded-lg"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="All">All Genres</option>
            <option value="House">House</option>
            <option value="Techno">Techno</option>
            <option value="Trance">Trance</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Electro">Electro</option>
          </select>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="w-full mb-10 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <img
              src={featuredNews.image?.url || ""}
              alt={featuredNews.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-bold">{featuredNews.title}</h2>
              <p className="text-gray-400 mt-2">{featuredNews.summary}</p>
              <a
                href={`/news/${featuredNews.documentId}`}
                className="inline-block mt-4 text-blue-500 hover:underline"
              >
                Read More →
              </a>
            </div>
          </div>
        )}

        {/* Other News */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(1).map((item) => (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <img
                src={item.image?.url || ""}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-xl font-bold mt-4">{item.title}</h3>
              <p className="text-gray-400 mt-2">{item.summary}</p>
              <a
                href={`/news/${item.id}`}
                className="inline-block mt-4 text-blue-500 hover:underline"
              >
                Read More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
