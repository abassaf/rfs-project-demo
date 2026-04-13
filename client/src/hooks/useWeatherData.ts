import { useEffect, useState } from 'react'

import type { CityResult, WeatherData } from '@/types/weather.types'

const WEATHER_ENDPOINT = 'http://localhost:3001/api/weather/current'

interface WeatherErrorResponse {
  error?: string
}

interface UseWeatherDataResult {
  data: WeatherData | null
  isLoading: boolean
  error: string | null
}

export const useWeatherData = (
  selectedCity: CityResult | null,
): UseWeatherDataResult => {
  const [data, setData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCity) {
      setData(null)
      setIsLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()

    setIsLoading(true)
    setError(null)

    const url = new URL(WEATHER_ENDPOINT)
    url.searchParams.set('lat', String(selectedCity.latitude))
    url.searchParams.set('lng', String(selectedCity.longitude))
    url.searchParams.set('timezone', selectedCity.timezone)

    fetch(url.toString(), { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const payload = (await response.json().catch(
            (): WeatherErrorResponse => ({}),
          )) as WeatherErrorResponse

          throw new Error(payload.error ?? 'Failed to fetch weather data.')
        }

        return response.json() as Promise<WeatherData>
      })
      .then((payload) => {
        setData(payload)
      })
      .catch((fetchError: unknown) => {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === 'AbortError'
        ) {
          return
        }

        setData(null)
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to fetch weather data.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [selectedCity])

  return {
    data,
    isLoading,
    error,
  }
}
