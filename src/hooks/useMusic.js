import React from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

export function useMusicApi(apiUrl, apiLocale) {
  const { data: musicResponse, error: musicError } = useSWR(
    apiUrl ? `${apiUrl}/musics?populate=*&locale=${apiLocale}` : null,
    fetcher
  );
  const { data: genresResponse, error: genresError } = useSWR(
    apiUrl ? `${apiUrl}/Music-Genres?locale=${apiLocale}` : null,
    fetcher
  );
  const { data: spotifyResponse, error: spotifyError } = useSWR(
    apiUrl ? `${apiUrl}/spotify-playlists` : null,
    fetcher
  );

  const musicItems = React.useMemo(() => {
    const items = musicResponse?.data || [];
    return items.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
  }, [musicResponse]);

  const genres = genresResponse?.data || [];

  const featuredPlaylists = React.useMemo(() => {
    // Default to empty array if no data
    const raw = spotifyResponse?.data;
    if (!Array.isArray(raw)) return [];
    return raw.map(item => item.URL);
  }, [spotifyResponse]);
  console.log(featuredPlaylists);
  

  const isLoading = !musicResponse && !musicError;
  const isError = !!(musicError || genresError || spotifyError);

  return { musicItems, genres, featuredPlaylists, isLoading, isError };
}