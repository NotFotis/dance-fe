// hooks/useAdvertisePage.js
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) =>
  axios.get(url).then(res => res.data.data);

export function useAdvertisePage(apiLocale) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/advertise?populate=services&locale=${apiLocale}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    about: data || {},
    isLoading: !error && !data,
    isError: error
  };
}
