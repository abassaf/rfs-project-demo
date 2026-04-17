import { useQuery } from '@tanstack/react-query'

import { weatherQueryKeys } from '@/lib/query-keys'
import type { CityResult, WeatherData } from '@/types/weather.types'

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
const WEATHER_ENDPOINT = `${API_BASE_URL}/api/weather/current`
const WEATHER_QUERY_STALE_TIME = 3 * 60 * 1000
const WEATHER_QUERY_GC_TIME = 6 * 60 * 1000

interface WeatherErrorResponse {
  error?: string
}

interface UseWeatherDataResult {
  data: WeatherData | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<unknown>
}

const fetchWeatherData = (
  selectedCity: CityResult,
  signal?: AbortSignal,
): Promise<WeatherData> => {
  const url = new URL(WEATHER_ENDPOINT)
  url.searchParams.set('lat', String(selectedCity.latitude))
  url.searchParams.set('lng', String(selectedCity.longitude))
  url.searchParams.set('timezone', selectedCity.timezone)
  url.searchParams.set('city', selectedCity.name)
  url.searchParams.set('country', selectedCity.country)
  if (selectedCity.region) {
    url.searchParams.set('region', selectedCity.region)
  }

  return fetch(url.toString(), { signal })
    .then(async (response) => {
      if (!response.ok) {
        const payload = (await response.json().catch(
          (): WeatherErrorResponse => ({}),
        )) as WeatherErrorResponse

        throw new Error(payload.error ?? 'Failed to fetch weather data.')
      }

      return response.json() as Promise<WeatherData>
    })
}

export const useWeatherData = (
  selectedCity: CityResult | null,
): UseWeatherDataResult => {
  const weatherQuery = useQuery({
    queryKey: weatherQueryKeys.current(selectedCity),
    queryFn: ({ signal }) =>
      selectedCity
        ? fetchWeatherData(selectedCity, signal)
        : Promise.reject(new Error('No city selected.')),
    enabled: Boolean(selectedCity),
    staleTime: WEATHER_QUERY_STALE_TIME,
    gcTime: WEATHER_QUERY_GC_TIME,
    retry: 1,
  })

  return {
    data: weatherQuery.data ?? null,
    isLoading: weatherQuery.isPending,
    error: weatherQuery.error instanceof Error ? weatherQuery.error.message : null,
    refetch: weatherQuery.refetch,
  }
}
