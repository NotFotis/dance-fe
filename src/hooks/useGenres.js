import useSWR from 'swr'
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data.data)

export function useGenres() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const url = `${API_URL}/Music-Genres?sort=name:asc`

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return {
    genres: Array.isArray(data) ? data : [],
    isLoading: !error && !data,
    isError: error,
  }
}
