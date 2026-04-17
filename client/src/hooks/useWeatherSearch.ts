import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { weatherQueryKeys } from '@/lib/query-keys'
import type { CityResult } from '@/types/weather.types'

const SEARCH_DEBOUNCE_MS = 400
const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
const SEARCH_ENDPOINT = `${API_BASE_URL}/api/weather/search`
const SEARCH_QUERY_STALE_TIME = 2 * 60 * 1000
const SEARCH_QUERY_GC_TIME = 5 * 60 * 1000

interface SearchErrorResponse {
  error?: string
}

interface UseWeatherSearchResult {
  results: CityResult[]
  isLoading: boolean
  error: string | null
}

const fetchCities = (
  query: string,
  signal?: AbortSignal,
): Promise<CityResult[]> => {
  const url = new URL(SEARCH_ENDPOINT)
  url.searchParams.set('q', query)

  return fetch(url.toString(), { signal })
    .then(async (response) => {
      if (!response.ok) {
        const payload = (await response.json().catch(
          (): SearchErrorResponse => ({}),
        )) as SearchErrorResponse

        throw new Error(payload.error ?? 'Failed to search for cities.')
      }

      return response.json() as Promise<CityResult[]>
    })
}

export const useWeatherSearch = (query: string): UseWeatherSearchResult => {
  const [debouncedQuery, setDebouncedQuery] = useState(query.trim())

  useEffect(() => {
    const normalizedQuery = query.trim()
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(normalizedQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [query])

  const citySearchQuery = useQuery({
    queryKey: weatherQueryKeys.search(debouncedQuery),
    queryFn: ({ signal }) => fetchCities(debouncedQuery, signal),
    enabled: Boolean(debouncedQuery),
    staleTime: SEARCH_QUERY_STALE_TIME,
    gcTime: SEARCH_QUERY_GC_TIME,
    retry: 1,
  })

  return {
    results: debouncedQuery ? citySearchQuery.data ?? [] : [],
    isLoading: Boolean(debouncedQuery) && citySearchQuery.isFetching,
    error:
      citySearchQuery.error instanceof Error ? citySearchQuery.error.message : null,
  }
}
