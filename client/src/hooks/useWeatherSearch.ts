import { useEffect, useState } from 'react'

import type { CityResult } from '@/types/weather.types'

const SEARCH_DEBOUNCE_MS = 400
const SEARCH_ENDPOINT = 'http://localhost:3001/api/weather/search'

interface SearchErrorResponse {
  error?: string
}

interface UseWeatherSearchResult {
  results: CityResult[]
  isLoading: boolean
  error: string | null
}

export const useWeatherSearch = (query: string): UseWeatherSearchResult => {
  const [results, setResults] = useState<CityResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      setResults([])
      setIsLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true)
      setError(null)

      const url = new URL(SEARCH_ENDPOINT)
      url.searchParams.set('q', normalizedQuery)

      fetch(url.toString(), { signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) {
            const payload = (await response.json().catch(
              (): SearchErrorResponse => ({}),
            )) as SearchErrorResponse

            throw new Error(payload.error ?? 'Failed to search for cities.')
          }

          return response.json() as Promise<CityResult[]>
        })
        .then((payload) => {
          setResults(payload)
        })
        .catch((fetchError: unknown) => {
          if (
            fetchError instanceof DOMException &&
            fetchError.name === 'AbortError'
          ) {
            return
          }

          setResults([])
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'Unable to search cities.',
          )
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false)
          }
        })
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [query])

  return {
    results,
    isLoading,
    error,
  }
}
