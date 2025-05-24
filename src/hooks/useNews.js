// hooks/useNews.js
import useSWR from 'swr'
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data.data)

export function useNews({
  limit,                    // if undefined, returns all; if a number, slices to that many
  populate = 'Image',
  sortField = 'Date',
  sortOrder = 'desc',
  apiLocale
} = {}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const url = `${API_URL}/dance-new?populate=${populate}&locale=${apiLocale}`

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  const isLoading = !error && !data
  const raw = data || []

  // sort
  const sorted = raw.slice().sort((a, b) => {
    const dir = sortOrder === 'asc' ? 1 : -1
    return dir * (new Date(a[sortField]) - new Date(b[sortField]))
  })

  // slice if limit is provided
  const news = typeof limit === 'number' ? sorted.slice(0, limit) : sorted

  return {
    news,
    isLoading,
    isError: error,
  }
}
