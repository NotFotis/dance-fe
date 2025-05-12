// hooks/useAdvertisePage.js
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) =>
  axios.get(url).then(res => res.data.data);

export function useCommunityPage() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/community-page?populate=*`,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    community: data || {},
    isLoading: !error && !data,
    isError: error
  };
}
