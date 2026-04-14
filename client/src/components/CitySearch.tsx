import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CityResult } from '@/types/weather.types'
import { useWeatherSearch } from '@/hooks/useWeatherSearch'

interface CitySearchProps {
  onCitySelect: (city: CityResult) => void
  onQueryChange: (query: string) => void
  query: string
  selectedCity?: CityResult | null
}

const formatCityLabel = (city: CityResult): string =>
  [city.name, city.region, city.country].filter(Boolean).join(', ')

export const CitySearch = ({
  onCitySelect,
  onQueryChange,
  query,
  selectedCity = null,
}: CitySearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { results, isLoading, error } = useWeatherSearch(query)

  const hasSearchState = useMemo(
    () => Boolean(query.trim()) && (isLoading || Boolean(error) || results.length > 0),
    [error, isLoading, query, results.length],
  )

  useEffect(() => {
    if (selectedCity) {
      onQueryChange(formatCityLabel(selectedCity))
      return
    }
  }, [onQueryChange, selectedCity])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor="city-search"
        className="mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-slate-500"
      >
        Search for a city
      </label>

      <input
        id="city-search"
        type="text"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          onQueryChange(event.target.value)
          setIsOpen(true)
        }}
        placeholder="Search Sydney, Melbourne, Tokyo..."
        autoComplete="off"
        className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-400/20"
      />

      {isOpen && hasSearchState ? (
        <Card className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-slate-100">City results</CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Pick a city to load current conditions and the forecast.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-3 pb-3">
            {isLoading ? (
              <p className="rounded-2xl bg-white/5 px-3 py-4 text-sm text-slate-400">
                Searching cities...
              </p>
            ) : null}

            {!isLoading && error ? (
              <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-3 py-4 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            {!isLoading && !error && results.length === 0 ? (
              <p className="rounded-2xl bg-white/5 px-3 py-4 text-sm text-slate-400">
                No cities matched your search.
              </p>
            ) : null}

            {!isLoading && !error && results.length > 0 ? (
              <ul className="space-y-2">
                {results.map((city) => {
                  const label = formatCityLabel(city)
                  const isSelected = selectedCity?.id === city.id

                  return (
                    <li key={city.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onCitySelect(city)
                          onQueryChange(label)
                          setIsOpen(false)
                        }}
                        className={cn(
                          'flex w-full items-start justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition',
                          isSelected
                            ? 'border-cyan-300/30 bg-cyan-400/10'
                            : 'border-white/10 bg-white/5 hover:border-cyan-300/20 hover:bg-white/8',
                        )}
                      >
                        <span>
                          <span className="block text-sm font-medium text-slate-100">
                            {city.name}
                          </span>
                          <span className="mt-1 block text-xs text-slate-400">
                            {[city.region, city.country].filter(Boolean).join(', ')}
                          </span>
                        </span>
                        <span className="shrink-0 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                          {city.timezone}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
