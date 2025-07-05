import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data.data);

export function useEvents(apiLocale, specialEvents = false) {
  // Build filter string only if specialEvents is true
  let filterString = '';
  if (specialEvents) {
    filterString = '&filters[specialEvent]=true'; // adjust the field name if necessary
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/events?populate=Image&populate=artists.Socials&populate=hosts&populate=music_genres&populate=seo&locale=${apiLocale}${filterString}`;

  const { data, error } = useSWR(
    url,
    fetcher,
    { revalidateOnFocus: false }
  );
  
  return {
    events: data || [],
    isLoading: !error && !data,
    isError: error
  };
}
