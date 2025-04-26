import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data.data);

export function useEvents() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/events?populate=*`,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    events: data || [],
    isLoading: !error && !data,
    isError: error
  };
}
