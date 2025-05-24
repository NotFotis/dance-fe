// hooks/useAdvertisePage.js
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) =>
  axios.get(url).then(res => res.data.data);

export function useCommunityPage(apiLocale) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/community-page?populate=Mix&locale=${apiLocale}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    community: data || {},
    isLoading: !error && !data,
    isError: error
  };
}
