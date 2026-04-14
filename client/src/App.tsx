import { useEffect, useState } from 'react'

import { CitySearch } from '@/components/CitySearch'
import { CurrentWeather } from '@/components/CurrentWeather'
import { ForecastStrip } from '@/components/ForecastStrip'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useWeatherSearch } from '@/hooks/useWeatherSearch'
import { useWeatherData } from '@/hooks/useWeatherData'
import type { CityResult } from '@/types/weather.types'

const CITY_QUERY_PARAM = 'city'
const CITY_ID_QUERY_PARAM = 'cityId'
const LATITUDE_QUERY_PARAM = 'lat'
const LONGITUDE_QUERY_PARAM = 'lng'
const TIMEZONE_QUERY_PARAM = 'timezone'
const COUNTRY_QUERY_PARAM = 'country'
const REGION_QUERY_PARAM = 'region'

const getInitialCityQuery = (): string => {
  const params = new URLSearchParams(window.location.search)
  return params.get(CITY_QUERY_PARAM)?.trim() ?? ''
}

const getInitialSelectedCity = (): CityResult | null => {
  const params = new URLSearchParams(window.location.search)
  const name = params.get(CITY_QUERY_PARAM)?.trim()
  const latitude = Number.parseFloat(params.get(LATITUDE_QUERY_PARAM) ?? '')
  const longitude = Number.parseFloat(params.get(LONGITUDE_QUERY_PARAM) ?? '')
  const timezone = params.get(TIMEZONE_QUERY_PARAM)?.trim()
  const country = params.get(COUNTRY_QUERY_PARAM)?.trim()

  if (
    !name ||
    !timezone ||
    !country ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }

  const parsedId = Number.parseInt(params.get(CITY_ID_QUERY_PARAM) ?? '', 10)

  return {
    id: Number.isFinite(parsedId) ? parsedId : -1,
    name,
    country,
    region: params.get(REGION_QUERY_PARAM)?.trim() || undefined,
    latitude,
    longitude,
    timezone,
  }
}

const formatCityLabel = (city: CityResult): string =>
  [city.name, city.region, city.country].filter(Boolean).join(', ')

const normalizeQuery = (value: string): string => value.trim().toLocaleLowerCase()

const App = () => {
  const [cityQuery, setCityQuery] = useState(getInitialCityQuery)
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(
    getInitialSelectedCity,
  )
  const { results: searchResults } = useWeatherSearch(cityQuery)
  const { data, isLoading, error, refetch } = useWeatherData(selectedCity)

  const handleCityQueryChange = (nextQuery: string) => {
    setCityQuery(nextQuery)

    if (
      selectedCity &&
      normalizeQuery(nextQuery) !== normalizeQuery(formatCityLabel(selectedCity))
    ) {
      setSelectedCity(null)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const normalizedQuery = cityQuery.trim()

    if (selectedCity) {
      params.set(CITY_QUERY_PARAM, selectedCity.name)
      params.set(CITY_ID_QUERY_PARAM, String(selectedCity.id))
      params.set(LATITUDE_QUERY_PARAM, String(selectedCity.latitude))
      params.set(LONGITUDE_QUERY_PARAM, String(selectedCity.longitude))
      params.set(TIMEZONE_QUERY_PARAM, selectedCity.timezone)
      params.set(COUNTRY_QUERY_PARAM, selectedCity.country)

      if (selectedCity.region) {
        params.set(REGION_QUERY_PARAM, selectedCity.region)
      } else {
        params.delete(REGION_QUERY_PARAM)
      }
    } else if (normalizedQuery) {
      params.set(CITY_QUERY_PARAM, normalizedQuery)
      params.delete(CITY_ID_QUERY_PARAM)
      params.delete(LATITUDE_QUERY_PARAM)
      params.delete(LONGITUDE_QUERY_PARAM)
      params.delete(TIMEZONE_QUERY_PARAM)
      params.delete(COUNTRY_QUERY_PARAM)
      params.delete(REGION_QUERY_PARAM)
    } else {
      params.delete(CITY_QUERY_PARAM)
      params.delete(CITY_ID_QUERY_PARAM)
      params.delete(LATITUDE_QUERY_PARAM)
      params.delete(LONGITUDE_QUERY_PARAM)
      params.delete(TIMEZONE_QUERY_PARAM)
      params.delete(COUNTRY_QUERY_PARAM)
      params.delete(REGION_QUERY_PARAM)
    }

    const nextQuery = params.toString()
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname

    window.history.replaceState({}, '', nextUrl)
  }, [cityQuery, selectedCity])

  useEffect(() => {
    if (selectedCity || !cityQuery.trim() || searchResults.length === 0) {
      return
    }

    const normalizedQuery = normalizeQuery(cityQuery)
    const matchedCity =
      searchResults.find(
        (city) => normalizeQuery(formatCityLabel(city)) === normalizedQuery,
      ) ??
      searchResults.find((city) => normalizeQuery(city.name) === normalizedQuery) ??
      searchResults[0]

    setSelectedCity(matchedCity)
  }, [cityQuery, searchResults, selectedCity])

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="absolute right-[-7rem] top-24 h-80 w-80 rounded-full bg-sky-500/14 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[96rem] items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <Card className="w-full border border-white/10 bg-slate-900/70 shadow-[0_32px_90px_-40px_rgba(14,165,233,0.45)] backdrop-blur-2xl">
          <article>
            <CardHeader className="gap-5 border-b border-white/10 pb-8">
              <header className="space-y-5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
                  Weather Briefing
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-4xl font-semibold tracking-[-0.05em] text-white md:text-6xl">
                    RFS Weather
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                    Search for any city to view current conditions and a
                    5-day forecast.
                  </CardDescription>
                </div>
              </header>
            </CardHeader>

            <CardContent className="p-5 md:p-7 xl:p-8">
              <div className="space-y-6">
                <section
                  aria-labelledby="search-heading"
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-black/20 md:p-6"
                >
                  <h2
                    id="search-heading"
                    className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400"
                  >
                    Search
                  </h2>
                  <div className="mt-4">
                    <CitySearch
                      onCitySelect={setSelectedCity}
                      onQueryChange={handleCityQueryChange}
                      query={cityQuery}
                      selectedCity={selectedCity}
                    />
                  </div>
                </section>

                <section
                  aria-labelledby="forecast-heading"
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-5 shadow-inner shadow-black/20 md:p-6"
                >
                  <h2
                    id="forecast-heading"
                    className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400"
                  >
                    Forecast
                  </h2>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:p-5">
                    {!selectedCity && !isLoading ? (
                      <div className="overflow-hidden rounded-[2rem] border border-cyan-300/10 bg-gradient-to-br from-cyan-400/10 via-slate-950/50 to-sky-500/10 px-6 py-10 sm:px-8">
                        <div className="max-w-2xl space-y-4">
                          <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-200/75">
                            Get started
                          </p>
                          <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                            Search for a city to load your weather briefing
                          </h3>
                          <p className="text-sm leading-7 text-slate-300 sm:text-base">
                            Use the city search above to load current conditions
                            and a five-day outlook.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {isLoading ? (
                      <div className="space-y-6">
                        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/8 via-slate-900/90 to-sky-500/8 p-5 sm:p-6">
                          <div className="space-y-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="space-y-3">
                                <Skeleton className="h-3 w-40 rounded-full" />
                                <Skeleton className="h-12 w-56 rounded-2xl" />
                                <Skeleton className="h-6 w-64 rounded-xl" />
                              </div>
                              <Skeleton className="h-24 w-full rounded-[1.75rem] sm:max-w-[240px]" />
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)]">
                              <div className="rounded-[2rem] bg-slate-950/35 p-5 sm:p-7">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                                  <Skeleton className="h-28 w-28 rounded-[2rem]" />
                                  <div className="space-y-3">
                                    <Skeleton className="h-20 w-36 rounded-2xl" />
                                    <Skeleton className="h-4 w-28 rounded-full" />
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                                <Skeleton className="h-28 rounded-[1.75rem]" />
                                <Skeleton className="h-28 rounded-[1.75rem]" />
                                <Skeleton className="h-28 rounded-[1.75rem]" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Skeleton className="h-3 w-36 rounded-full" />
                            <Skeleton className="h-4 w-64 rounded-full" />
                          </div>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            <Skeleton className="h-60 rounded-3xl" />
                            <Skeleton className="h-60 rounded-3xl" />
                            <Skeleton className="h-60 rounded-3xl" />
                            <Skeleton className="h-60 rounded-3xl" />
                            <Skeleton className="h-60 rounded-3xl" />
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {!isLoading && error ? (
                      <Card className="border border-rose-400/20 bg-rose-400/10">
                        <CardHeader className="gap-3 pb-3">
                          <CardTitle className="text-xl text-rose-100">
                            Weather data unavailable
                          </CardTitle>
                          <CardDescription className="text-sm text-rose-100/80">
                            {error}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm leading-7 text-rose-50/85">
                            Retry the request, or choose the city again from the
                            search input if the backend was temporarily
                            unavailable.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                void refetch()
                              }}
                              className="rounded-2xl border border-rose-200/20 bg-rose-50/10 px-4 py-2 text-sm font-medium text-rose-50 transition hover:bg-rose-50/15"
                            >
                              Retry weather request
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCity(null)
                                setCityQuery('')
                              }}
                              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
                            >
                              Search another city
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}

                    {!isLoading && !error && data ? (
                      <div className="space-y-6">
                        <CurrentWeather data={data} />
                        <ForecastStrip forecast={data.forecast} />
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>
            </CardContent>
          </article>
        </Card>
      </div>
    </main>
  )
}

export default App
