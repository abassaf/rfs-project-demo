import { useState } from 'react'

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
import { useWeatherData } from '@/hooks/useWeatherData'
import type { CityResult } from '@/types/weather.types'

const App = () => {
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null)
  const { data, isLoading, error } = useWeatherData(selectedCity)

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
                    A premium weather dashboard shell for fast city search,
                    current conditions, and a clean multi-day forecast
                    experience.
                  </CardDescription>
                </div>
              </header>
            </CardHeader>

            <CardContent className="grid gap-6 p-5 md:p-7 xl:grid-cols-[minmax(0,1.7fr)_320px] xl:gap-8 xl:p-8">
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
                      <div className="space-y-3 py-8 text-slate-400">
                        <p className="text-lg font-medium text-slate-200">
                          Search for a city to begin
                        </p>
                        <p className="max-w-xl text-sm leading-7">
                          Choose a city from the autocomplete results to load
                          current conditions and the five-day forecast.
                        </p>
                      </div>
                    ) : null}

                    {isLoading ? (
                      <div className="space-y-4 py-4">
                        <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
                        <div className="h-14 w-56 animate-pulse rounded-2xl bg-white/10" />
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="h-20 animate-pulse rounded-2xl bg-white/8" />
                          <div className="h-20 animate-pulse rounded-2xl bg-white/8" />
                          <div className="h-20 animate-pulse rounded-2xl bg-white/8" />
                        </div>
                      </div>
                    ) : null}

                    {!isLoading && error ? (
                      <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-5 text-sm text-rose-100">
                        {error}
                      </div>
                    ) : null}

                    {!isLoading && !error && data && selectedCity ? (
                      <div className="space-y-6">
                        <CurrentWeather
                          data={{
                            ...data,
                            city: selectedCity.name,
                            country: selectedCity.country,
                            region: selectedCity.region,
                          }}
                        />
                        <ForecastStrip forecast={data.forecast} />
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>

              <aside
                aria-labelledby="design-direction-heading"
                className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 xl:sticky xl:top-8 xl:self-start"
              >
                <div className="space-y-5">
                  <div>
                    <h2
                      id="design-direction-heading"
                      className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500"
                    >
                      Session
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      The search panel now drives live backend lookups with a
                      centered glass-card layout tuned for weather browsing.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Selected
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">
                        {selectedCity ? selectedCity.name : 'None'}
                      </p>
                    </section>
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Timezone
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">
                        {selectedCity?.timezone ?? 'Awaiting selection'}
                      </p>
                    </section>
                    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Status
                      </h3>
                      <p className="mt-2 text-sm text-slate-200">
                        {isLoading
                          ? 'Loading'
                          : error
                            ? 'Error'
                            : data
                              ? 'Ready'
                              : 'Idle'}
                      </p>
                    </section>
                  </div>
                </div>
              </aside>
            </CardContent>
          </article>
        </Card>
      </div>
    </main>
  )
}

export default App
