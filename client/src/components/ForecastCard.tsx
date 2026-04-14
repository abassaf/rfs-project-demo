import { Card, CardContent } from '@/components/ui/card'
import type { DailyForecast } from '@/types/weather.types'

interface ForecastCardProps {
  forecast: DailyForecast
}

const formatForecastDate = (value: string): string =>
  new Intl.DateTimeFormat('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  return (
    <Card className="h-full border border-white/10 bg-white/6 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.95)] backdrop-blur-xl">
      <CardContent className="flex h-full flex-col justify-between space-y-5 p-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {formatForecastDate(forecast.date)}
          </p>
          <p className="min-h-[2.5rem] text-sm font-medium leading-5 text-slate-100">
            {forecast.weatherDescription}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-4xl" aria-hidden="true">
            {forecast.weatherIcon}
          </span>
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">
              {Math.round(forecast.maxTemperature)}°
            </p>
            <p className="text-sm text-slate-400">
              {Math.round(forecast.minTemperature)}°
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-slate-950/50 px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Precipitation
          </p>
          <p className="mt-2 text-sm font-medium text-slate-100">
            {forecast.precipitationProbability}%
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
