"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/NavBar";
import parse from "html-react-parser";
import Link from "next/link";

export default function NewsDetailsPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Use populate=* to fetch all related fields (Image, genres, author, Content, etc.)
        const response = await axios.get(`${API_URL}/dance-new/${id}?populate=*`);
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

  // Render dynamic zone content
  const renderContent = () => {
    if (!news.Content || !Array.isArray(news.Content)) {
      return <p>No content available.</p>;
    }
    return news.Content.map((block, index) => {
      // Check for rich-text component
      if (block.__component === "shared.rich-text") {
        return (
          <div key={index} className="rich-text">
            {parse(block.body)}
          </div>
        );
      }
      // Check for media component (example handling)
      if (block.__component === "shared.media") {
        return (
          <div key={index} className="media my-4">
            {block.url ? (
              <img src={`${URL}${block.url}`} alt="Media content" className="w-full" />
            ) : (
              <p>Media content</p>
            )}
          </div>
        );
      }
      // Fallback for unsupported components
      return (
        <div key={index} className="unsupported-component">
          Unsupported component: {block.__component}
        </div>
      );
    });
  };

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center text-xl">
      <Navbar />
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
          <p className="text-gray-400 text-center mb-2">By {news.author.name}</p>
        )}

        {/* Genres */}
        {news.genres && news.genres.data && news.genres.data.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {news.genres.data.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-600 px-2 py-1 rounded-full text-sm"
              >
                {genre.attributes.name}
              </span>
            ))}
          </div>
        )}

        {/* News Content */}
        <div className="prose prose-lg text-gray-300 leading-relaxed max-w-none">
          {renderContent()}
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
