/**
 * A single location match returned by the Open-Meteo geocoding API.
 */
export interface GeocodingResult {
  /** Stable Open-Meteo location identifier. */
  id: number;
  /** Human-readable city or locality name. */
  name: string;
  /** Latitude in decimal degrees. */
  latitude: number;
  /** Longitude in decimal degrees. */
  longitude: number;
  /** Elevation above sea level in meters. */
  elevation?: number;
  /** GeoNames feature classification code. */
  feature_code?: string;
  /** ISO 3166-1 alpha-2 country code. */
  country_code: string;
  /** IANA timezone name for the location. */
  timezone: string;
  /** Country name. */
  country: string;
  /** First-level administrative region, for example a state. */
  admin1?: string;
  /** Second-level administrative region. */
  admin2?: string;
  /** Third-level administrative region. */
  admin3?: string;
  /** Fourth-level administrative region. */
  admin4?: string;
  /** Population count when available. */
  population?: number;
  /** Associated postal codes when available. */
  postcodes?: string[];
}

/**
 * Response envelope returned by the Open-Meteo geocoding search endpoint.
 */
export interface GeocodingApiResponse {
  /** Time spent generating the response in milliseconds. */
  generationtime_ms?: number;
  /** Matched locations. Omitted when no results are found. */
  results?: GeocodingResult[];
}

/**
 * Units metadata for the current weather payload.
 */
export interface OpenMeteoCurrentUnits {
  /** ISO 8601 timestamp format descriptor. */
  time: string;
  /** Unit for the current temperature value. */
  temperature_2m: string;
  /** Unit for the current humidity value. */
  relative_humidity_2m: string;
  /** Unit for the current wind speed value. */
  wind_speed_10m: string;
  /** Code system used for weather conditions. */
  weathercode: string;
}

/**
 * Current weather measurements returned by Open-Meteo.
 */
export interface OpenMeteoCurrentWeather {
  /** Observation timestamp in ISO 8601 format. */
  time: string;
  /** Current air temperature at 2 meters. */
  temperature_2m: number;
  /** Current relative humidity at 2 meters. */
  relative_humidity_2m: number;
  /** Current wind speed at 10 meters. */
  wind_speed_10m: number;
  /** WMO weather interpretation code. */
  weathercode: number;
}

/**
 * Units metadata for the daily forecast payload.
 */
export interface OpenMeteoDailyUnits {
  /** Date format descriptor. */
  time: string;
  /** Unit for the daily maximum temperature values. */
  temperature_2m_max: string;
  /** Unit for the daily minimum temperature values. */
  temperature_2m_min: string;
  /** Code system used for daily weather conditions. */
  weathercode: string;
  /** Unit for daily precipitation probability values. */
  precipitation_probability_max: string;
}

/**
 * Daily forecast arrays returned by Open-Meteo.
 */
export interface OpenMeteoDailyForecast {
  /** Forecast dates in ISO 8601 date format. */
  time: string[];
  /** Daily maximum temperatures aligned by index with `time`. */
  temperature_2m_max: number[];
  /** Daily minimum temperatures aligned by index with `time`. */
  temperature_2m_min: number[];
  /** Daily WMO weather codes aligned by index with `time`. */
  weathercode: number[];
  /** Daily maximum precipitation probability aligned by index with `time`. */
  precipitation_probability_max: number[];
}

/**
 * Raw forecast response returned by the Open-Meteo weather endpoint.
 */
export interface OpenMeteoWeatherResponse {
  /** Latitude used for the forecast lookup. */
  latitude: number;
  /** Longitude used for the forecast lookup. */
  longitude: number;
  /** Forecast model generation time in milliseconds. */
  generationtime_ms: number;
  /** Timezone offset from UTC in seconds. */
  utc_offset_seconds: number;
  /** IANA timezone name for the forecast. */
  timezone: string;
  /** Short timezone abbreviation. */
  timezone_abbreviation: string;
  /** Elevation above sea level in meters. */
  elevation: number;
  /** Units metadata for current conditions. */
  current_units: OpenMeteoCurrentUnits;
  /** Current weather measurements. */
  current: OpenMeteoCurrentWeather;
  /** Units metadata for the daily forecast arrays. */
  daily_units: OpenMeteoDailyUnits;
  /** Daily forecast arrays. */
  daily: OpenMeteoDailyForecast;
}

/**
 * Normalized city data returned by the backend search endpoint.
 */
export interface CityResult {
  /** Stable city identifier. */
  id: number;
  /** City or locality name. */
  name: string;
  /** Country display name. */
  country: string;
  /** Optional region or state label. */
  region?: string;
  /** Latitude in decimal degrees. */
  latitude: number;
  /** Longitude in decimal degrees. */
  longitude: number;
  /** IANA timezone name for the city. */
  timezone: string;
}

/**
 * A cleaned daily forecast item consumed by the frontend.
 */
export interface DailyForecast {
  /** Forecast date in ISO 8601 format. */
  date: string;
  /** Minimum temperature for the day. */
  minTemperature: number;
  /** Maximum temperature for the day. */
  maxTemperature: number;
  /** Maximum precipitation probability for the day. */
  precipitationProbability: number;
  /** WMO weather interpretation code. */
  weatherCode: number;
  /** Human-readable weather summary. */
  weatherDescription: string;
  /** Emoji or icon token representing the weather. */
  weatherIcon: string;
}

/**
 * Normalized weather payload returned by the backend and rendered by the client.
 */
export interface WeatherData {
  /** Selected city name. */
  city: string;
  /** Country display name. */
  country: string;
  /** Optional region or state label. */
  region?: string;
  /** Forecast timezone. */
  timezone: string;
  /** Coordinates for the selected city. */
  coordinates: {
    latitude: number;
    longitude: number;
  };
  /** Current observed temperature. */
  temperature: number;
  /** Current relative humidity percentage. */
  humidity: number;
  /** Current wind speed. */
  windSpeed: number;
  /** WMO weather interpretation code for current conditions. */
  weatherCode: number;
  /** Human-readable current weather summary. */
  weatherDescription: string;
  /** Emoji or icon token representing the current weather. */
  weatherIcon: string;
  /** Current observation timestamp. */
  observedAt: string;
  /** Daily forecast entries, typically five days. */
  forecast: DailyForecast[];
}
