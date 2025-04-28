// hooks/useGenres.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/Music-Genres`);
        if (isMounted) setGenres(res.data.data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [API_URL]);

  return { genres, loading, error };
}
