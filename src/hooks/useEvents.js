import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data.data);

export function useEvents(apiLocale, specialEvents = false) {
  // Build filter string only if specialEvents is true
  let filterString = '';
  if (specialEvents) {
    filterString += '&filters[specialEvent]=true'; // adjust field name if necessary
  }

  // Always filter events after today (inclusive)
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  filterString += `&filters[Date][$gte]=${todayStr}`; // adjust 'Date' field if needed

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
