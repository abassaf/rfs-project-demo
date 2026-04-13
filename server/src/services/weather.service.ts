import axios from 'axios';

import type {
  CityResult,
  DailyForecast,
  GeocodingApiResponse,
  GeocodingResult,
  OpenMeteoWeatherResponse,
  WeatherData,
} from '../types/weather.types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;

interface WeatherCodeMetadata {
  description: string;
  icon: string;
}

export class UpstreamApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamApiError';
  }
}

// Open-Meteo uses WMO weather interpretation codes for current conditions and forecasts.
const WEATHER_CODE_MAP: Record<number, WeatherCodeMetadata> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌧️' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌦️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌧️' },
  67: { description: 'Heavy freezing rain', icon: '🌧️' },
  71: { description: 'Slight snow fall', icon: '🌨️' },
  73: { description: 'Moderate snow fall', icon: '🌨️' },
  75: { description: 'Heavy snow fall', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

const DEFAULT_WEATHER_CODE: WeatherCodeMetadata = {
  description: 'Unknown weather',
  icon: '❓',
};

function throwUpstreamApiError(
  error: unknown,
  fallbackMessage: string,
  source: string,
): never {
  if (axios.isAxiosError(error)) {
    throw new UpstreamApiError(
      `${source} failed with status ${error.response?.status ?? 'unknown'}.`,
    );
  }

  throw new UpstreamApiError(fallbackMessage);
}

function getWeatherCodeMetadata(code: number): WeatherCodeMetadata {
  return WEATHER_CODE_MAP[code] ?? DEFAULT_WEATHER_CODE;
}

function normalizeCityResult(result: GeocodingResult): CityResult {
  return {
    id: result.id,
    name: result.name,
    country: result.country,
    region: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

function buildDailyForecast(
  daily: OpenMeteoWeatherResponse['daily'],
): DailyForecast[] {
  return daily.time.slice(0, FORECAST_DAYS).map((date, index) => {
    const weatherCode = daily.weathercode[index];
    const weather = getWeatherCodeMetadata(weatherCode);

    return {
      date,
      minTemperature: daily.temperature_2m_min[index],
      maxTemperature: daily.temperature_2m_max[index],
      precipitationProbability: daily.precipitation_probability_max[index],
      weatherCode,
      weatherDescription: weather.description,
      weatherIcon: weather.icon,
    };
  });
}

function fallbackCityNameFromTimezone(timezone: string): string {
  const parts = timezone.split('/');
  const rawLabel = parts[parts.length - 1] ?? 'Selected location';
  return rawLabel.replace(/_/g, ' ');
}

export function searchCities(query: string): Promise<CityResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return Promise.resolve([]);
  }

  return axios
    .get<GeocodingApiResponse>(GEOCODING_API_URL, {
      params: {
        name: normalizedQuery,
        count: 5,
      },
    })
    .then((response) => (response.data.results ?? []).map(normalizeCityResult))
    .catch((error: unknown) =>
      throwUpstreamApiError(
        error,
        'Unexpected geocoding error.',
        'Open-Meteo geocoding request',
      ),
    );
}

export function getWeatherForCity(
  lat: number,
  lng: number,
  timezone: string,
): Promise<WeatherData> {
  return axios
    .get<OpenMeteoWeatherResponse>(WEATHER_API_URL, {
      params: {
        latitude: lat,
        longitude: lng,
        current:
          'temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode',
        daily:
          'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
        timezone,
      },
    })
    .then((response) => {
      const { data } = response;
      const currentWeather = getWeatherCodeMetadata(data.current.weathercode);

      return {
        city: fallbackCityNameFromTimezone(data.timezone),
        country: '',
        timezone: data.timezone,
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weathercode,
        weatherDescription: currentWeather.description,
        weatherIcon: currentWeather.icon,
        observedAt: data.current.time,
        forecast: buildDailyForecast(data.daily),
      };
    })
    .catch((error: unknown) =>
      throwUpstreamApiError(
        error,
        'Unexpected weather lookup error.',
        'Open-Meteo weather request',
      ),
    );
}
