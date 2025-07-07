// hooks/useNews.js
import useSWR from 'swr'
import axios from 'axios'

const fetcher = url => axios.get(url).then(res => res.data.data)

export function useNews({
  limit,
  populate = 'Image',
  sortField = 'Date',
  sortOrder = 'desc',
  apiLocale
} = {}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const url = `${API_URL}/dance-new?populate=${populate}&locale=${apiLocale}&sort=${sortField}:${sortOrder}`

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  const isLoading = !error && !data
  const raw = data || []

  // slice if limit is provided
  const news = typeof limit === 'number' ? raw.slice(0, limit) : raw

  return {
    news,
    isLoading,
    isError: error,
  }
}
