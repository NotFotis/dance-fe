"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/NavBar";
import parse from "html-react-parser";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

export default function NewsDetailsPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Use populate=* to fetch all related fields (Image, music_genres, author, description, etc.)
        const response = await axios.get(
          `${API_URL}/dance-new/${id}?populate=*`
        );
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-white py-12 text-2xl">
        Loading news details...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="text-center text-red-500 py-12 text-2xl">
        News article not found
      </div>
    );
  }

  // Construct the current URL for sharing
  const currentUrl = `${URL}/news/${id}`;

  // Share handlers
  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${encodeURIComponent(news.Title)}`,
      "_blank"
    );
  };

  const shareToInstagram = () => {
    // Instagram does not support direct sharing via URL, so we simply open Instagram’s website.
    window.open("https://www.instagram.com/", "_blank");
  };

  // Render description content by joining each paragraph's text and parsing it
  const renderDescription = () => {
    if (!news.description || !Array.isArray(news.description)) {
      return <p>No description available.</p>;
    }
    return news.description.map((block, index) => {
      if (block.type === "paragraph") {
        const textContent = block.children.map((child) => child.text).join("");
        return (
          <p key={index} className="mb-6">
            {parse(textContent)}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center text-xl relative">
      <Navbar />

      {/* Fixed Share Buttons on the left side */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-50">
        <button
          onClick={shareToFacebook}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
        >
          <FaFacebookF size={24} />
        </button>
        <button
          onClick={shareToInstagram}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
        >
          <FaInstagram size={24} />
        </button>
        <button
          onClick={shareToTwitter}
          className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
        >
          <FontAwesomeIcon icon={faXTwitter} size={20} />
        </button>
      </div>

      <div className="max-w-4xl w-full px-6 mt-20">
        {/* News Image */}
        {news.Image && news.Image.url && (
          <div className="w-full h-[400px] rounded-lg overflow-hidden mb-6">
            <img
              src={`${URL}${news.Image.url}`}
              alt={news.Title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* News Title */}
        <h1 className="text-4xl font-bold mb-4 text-center">{news.Title}</h1>

        {/* News Date */}
        <p className="text-gray-400 text-center mb-6">
          🗓 {new Date(news.Date).toLocaleDateString()}
        </p>

        {/* Author */}
        {news.author && news.author.name && (
          <p className="text-gray-400 text-center mb-2 text-2sm">
            By {news.author.name}
          </p>
        )}

        {/* Music Genres */}
        {news.music_genres && news.music_genres.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {news.music_genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-600 px-2 py-1 rounded-full text-2sm"
              >
                {genre.attributes && genre.attributes.name
                  ? genre.attributes.name
                  : "No Genre"}
              </span>
            ))}
          </div>
        )}

        {/* News Description */}
        <div className="prose prose-lg text-gray-300 leading-relaxed max-w-none">
          {renderDescription()}
        </div>

        {/* Back to News */}
        <div className="mt-10 text-center">
          <Link href="/news" className="text-blue-500 hover:underline text-lg">
            ← Back to News
          </Link>
        </div>
      </div>
    </div>
  );
}
