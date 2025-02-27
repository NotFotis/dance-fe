"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/NavBar";
import parse from "html-react-parser";
import Link from "next/link";

export default function NewsDetailsPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${API_URL}/dance-new/${id}?populate=Image`);
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
    return <div className="text-center text-white py-12 text-2xl">Loading news details...</div>;
  }

  if (!news) {
    return <div className="text-center text-red-500 py-12 text-2xl">News article not found</div>;
  }

  const renderContent = () => {
    if (!news.Content) return <p>No content available.</p>;
    
    if (Array.isArray(news.Content)) {
      return news.Content.map((block, index) => (
        <p key={index}>{block.children?.map((child, i) => child.text || "").join(" ")}</p>
      ));
    }
    
    if (typeof news.Content === "string") {
      return parse(news.Content);
    }
    
    return <p>No content available.</p>;
  };

  return (
    <div className="bg-gradient min-h-screen text-white flex flex-col items-center">
      <Navbar />
      <div className="max-w-4xl w-full px-6 mt-20">
        {/* News Image */}
        {news.Image?.url && (
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
        <p className="text-gray-400 text-center mb-6">🗓 {new Date(news.Date).toLocaleDateString()}</p>

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