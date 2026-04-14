import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { WeatherData } from '@/types/weather.types'

interface CurrentWeatherProps {
  data: WeatherData
}

const formatObservedAt = (value: string): string =>
  new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    weekday: 'short',
  }).format(new Date(value))

export const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  return (
    <Card className="overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-400/12 via-slate-900/95 to-sky-500/10 shadow-[0_24px_80px_-38px_rgba(34,211,238,0.45)] backdrop-blur-2xl">
      <CardHeader className="gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-200/75">
              Current conditions
            </p>
            <CardTitle className="text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              {data.city}
            </CardTitle>
            <CardDescription className="text-sm text-slate-300">
              {[data.region, data.country].filter(Boolean).join(', ') || data.timezone}
            </CardDescription>
          </div>

          <div className="w-full rounded-3xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-4 text-left sm:max-w-[240px] sm:text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">
              Updated
            </p>
            <p className="mt-2 text-sm text-slate-100">{formatObservedAt(data.observedAt)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.9fr)] lg:items-stretch">
        <section className="flex min-h-[280px] flex-col justify-end gap-8 rounded-[2rem] bg-slate-950/35 p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 text-6xl shadow-inner shadow-black/20">
              <span aria-hidden="true">{data.weatherIcon}</span>
            </div>

            <div>
              <p className="text-7xl font-semibold tracking-[-0.08em] text-white md:text-8xl">
                {Math.round(data.temperature)}°
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.24em] text-slate-400">
                {data.weatherDescription}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Coordinates
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {data.coordinates.latitude.toFixed(2)}, {data.coordinates.longitude.toFixed(2)}
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Conditions
              </p>
              <p className="mt-2 text-sm font-medium text-slate-100">
                {data.weatherDescription}
              </p>
            </article>
          </div>
        </section>

        <section
          aria-label="Current weather metrics"
          className="grid gap-3 self-stretch sm:grid-cols-3 lg:grid-cols-1"
        >
          <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Humidity
            </p>
            <p className="mt-4 text-2xl font-medium text-slate-100">{data.humidity}%</p>
          </article>
          <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Wind speed
            </p>
            <p className="mt-4 text-2xl font-medium text-slate-100">
              {data.windSpeed} km/h
            </p>
          </article>
          <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Timezone
            </p>
            <p className="mt-4 text-sm font-medium text-slate-100 break-words">{data.timezone}</p>
          </article>
        </section>
      </CardContent>
    </Card>
  )
}
