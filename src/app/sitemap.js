// src/app/sitemap.js
import { getAllArtistsIds } from "@/lib/artists";
import { routing } from "../../i18n/routing";
import { getAllEventIds } from "../lib/events";
import { getAllNewsIds } from "../lib/news";

const host = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  // Collect all routes
  const staticPaths = ["", "about", "advertise", "calendar", "music", "news","community","artists"];
  const [eventIds, newsIds, artistsIds] = await Promise.all([
    getAllEventIds(),
    getAllNewsIds(),
    getAllArtistsIds()
  ]);
  
  const dynamicPaths = [
    ...eventIds.map(id => `events/${id}`),
    ...newsIds.map(id => `news/${id}`),
    ...artistsIds.map(id => `artists/${id}`)
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];

  // Build sitemap entries
  return allPaths.flatMap(path =>
    routing.locales.map(locale => ({
      url: `${host}/${locale}${path ? `/${path}` : ""}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map(alt => [
            alt,
            `${host}/${alt}${path ? `/${path}` : ""}`
          ])
        )
      }
    }))
  );
}
