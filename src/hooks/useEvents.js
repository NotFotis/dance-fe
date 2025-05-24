import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data.data);

export function useEvents(apiLocale) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/events?populate=Image&populate=artists.Socials&populate=hosts&populate=music_genres&populate=seo&locale=${apiLocale}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    events: data || [],
    isLoading: !error && !data,
    isError: error
  };
}
