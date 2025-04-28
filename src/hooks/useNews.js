// hooks/useNews.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useNews({
  limit,                    // if undefined, returns all; if a number, slices to that many
  populate = '*',
  sortField = 'Date',
  sortOrder = 'desc',
} = {}) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}/dance-new?populate=${populate}`
        );
        const items = res.data.data;

        // sort
        const sorted = items.sort((a, b) => {
          const dir = sortOrder === 'asc' ? 1 : -1;
          return dir * (new Date(a[sortField]) - new Date(b[sortField]));
        });

        // slice if limit is provided
        const out = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

        if (isMounted) setNews(out);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [API_URL, limit, populate, sortField, sortOrder]);

  return { news, loading, error };
}
