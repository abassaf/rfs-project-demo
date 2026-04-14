import { ForecastCard } from '@/components/ForecastCard'
import type { DailyForecast } from '@/types/weather.types'

interface ForecastStripProps {
  forecast: DailyForecast[]
}

export const ForecastStrip = ({ forecast }: ForecastStripProps) => {
  return (
    <section aria-labelledby="forecast-strip-heading" className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="forecast-strip-heading"
            className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400"
          >
            Five day outlook
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A quick snapshot of conditions for the coming days.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {forecast.slice(0, 5).map((day) => (
          <ForecastCard key={day.date} forecast={day} />
        ))}
      </div>
    </section>
  )
}
