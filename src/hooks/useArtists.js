import useSWR from 'swr'
import axios from 'axios'

// Returns Strapi's raw data object
const fetcher = url => axios.get(url).then(res => res.data);

export function useArtists({
  search = '',
   genre = '',
  apiLocale = 'en',
  page = 1,
  pageSize = 16,
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const params = [
    `locale=${apiLocale}`,
    `pagination[page]=${page}`,
    `pagination[pageSize]=${pageSize}`,
    'sort=Name:asc',
    'populate=Image',
    'populate=music_genres',
    'populate=Socials'
  ];

  if (search) {
    params.push(`filters[Name][$containsi]=${encodeURIComponent(search)}`);
  }
  if (genre) {
    // Assumes genre is the NAME of the genre. If you want to use id, change accordingly.
    params.push(`filters[music_genres][name][$eq]=${encodeURIComponent(genre)}`);
  }
  const url = `${API_URL}/artists?${params.join('&')}`;

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 500,
  });

  return {
    artists: Array.isArray(data?.data) ? data.data : [],
    isLoading: !error && !data,
    isError: error,
    total: data?.meta?.pagination?.total || 0,
  }
}
