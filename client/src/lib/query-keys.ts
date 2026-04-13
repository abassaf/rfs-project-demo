import type { CityResult } from '@/types/weather.types'

export const weatherQueryKeys = {
  all: ['weather'] as const,
  search: (query: string) => [...weatherQueryKeys.all, 'search', query] as const,
  current: (city: CityResult | null) =>
    [
      ...weatherQueryKeys.all,
      'current',
      city?.id ?? null,
      city?.latitude ?? null,
      city?.longitude ?? null,
      city?.timezone ?? null,
    ] as const,
}
