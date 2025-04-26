"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFacebookF, FaInstagram, FaDiscord } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useTranslations } from "next-intl";
import parse from "html-react-parser";

export default function NewsDetailsModal({ documentId, onClose }) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const URL = process.env.NEXT_PUBLIC_URL;
  const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL;
  const t = useTranslations("newsDetails");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/dance-new?filters[documentId][$eq]=${documentId}&populate=*`
        );
        const [item] = response.data.data || [];
        setNews(item);
      } catch (error) {
        console.error("Error fetching news details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (documentId) fetchNews();
  }, [documentId, API_URL]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-95 z-50 p-4 text-red-500">
        {t("notFound")}
      </div>
    );
  }

  const { Title, publishedAt, description, Image, author, music_genres } = news;
  const shareUrl = `${URL}/news/${documentId}`;

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };
  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(Title)}`,
      "_blank"
    );
  };
  const shareToInstagram = () => {
    window.open("https://www.instagram.com/", "_blank");
  };

  const renderDescription = () => {
    if (!description) return <p>{t("noDescription")}</p>;
    if (Array.isArray(description)) {
      return description.map((block, index) => {
        if (block.type === "paragraph" && block.children) {
          const textContent = block.children.map((child) => child.text).join("");
          return (
            <p key={index} className="mb-4">
              {parse(textContent)}
            </p>
          );
        }
        return null;
      });
    }
    if (typeof description === "string") {
      return <div>{parse(description)}</div>;
    }
    if (typeof description === "object" && description.children) {
      const textContent = Array.isArray(description.children)
        ? description.children.map((child) => child.text).join("")
        : "";
      return <div>{parse(textContent)}</div>;
    }
    return <div>{JSON.stringify(description)}</div>;
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative bg-black text-white rounded-lg shadow-xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Round Close Button */}
        <div className="sticky top-0 z-50 flex justify-end bg-transparent">
          <button
            onClick={onClose}
            className="m-4 flex items-center justify-center w-12 h-12 rounded-full bg-black bg-opacity-0 text-5xl text-white leading-none hover:bg-opacity-100"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* News Image on Top */}
        {Image && Image.url && (
          <div className="w-full h-64 sm:h-full overflow-hidden">
            <img
              src={`${URL}${Image.url}`}
              alt={Title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Details Content */}
        <div className="py-6 px-4 sm:px-6 md:px-8 pb-8 text-center">
          <h2 className="text-5xl font-bold mb-6">{Title}</h2>
          {publishedAt && (
            <p className="text-gray-400 text-sm mb-4">
              {new Date(publishedAt).toLocaleDateString()}
            </p>
          )}
          {author && author.name && (
            <p className="text-gray-400 text-sm mb-4">By {author.name}</p>
          )}
          {music_genres && music_genres.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {music_genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-blue-600 px-2 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          <div className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {renderDescription()}
          </div>

          {/* Discord Discussion Prompt */}
          <div className="mt-8 mb-4">
            <p className="text-gray-200 mb-2">{t("joinDiscussion")}</p>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 inline-flex items-center justify-center"
            >
              <FaDiscord size={24} />
            </a>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={shareToFacebook}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <FaFacebookF size={20} />
            </button>
            <button
              onClick={shareToInstagram}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <FaInstagram size={20} />
            </button>
            <button
              onClick={shareToTwitter}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faXTwitter} size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
