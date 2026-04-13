import { Router } from 'express';

import {
  getWeatherForCity,
  UpstreamApiError,
  searchCities,
} from '../services/weather.service';

export const weatherRouter = Router();

function getUpstreamErrorMessage(error: unknown, fallbackMessage: string): string {
  return error instanceof UpstreamApiError ? error.message : fallbackMessage;
}

weatherRouter.get('/search', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  if (!query) {
    return res.status(400).json({
      error: 'Query parameter "q" is required.',
    });
  }

  return searchCities(query)
    .then((results) => res.status(200).json(results))
    .catch((error: unknown) =>
      res.status(502).json({
        error: getUpstreamErrorMessage(
          error,
          'Failed to fetch city search results.',
        ),
      }),
    );
});

weatherRouter.get('/current', (req, res) => {
  const lat =
    typeof req.query.lat === 'string' ? Number.parseFloat(req.query.lat) : NaN;
  const lng =
    typeof req.query.lng === 'string' ? Number.parseFloat(req.query.lng) : NaN;
  const timezone =
    typeof req.query.timezone === 'string' ? req.query.timezone.trim() : '';

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      error: 'Query parameter "lat" must be a valid latitude.',
    });
  }

  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      error: 'Query parameter "lng" must be a valid longitude.',
    });
  }

  if (!timezone) {
    return res.status(400).json({
      error: 'Query parameter "timezone" is required.',
    });
  }

  return getWeatherForCity(lat, lng, timezone)
    .then((weatherData) => res.status(200).json(weatherData))
    .catch((error: unknown) =>
      res.status(502).json({
        error: getUpstreamErrorMessage(error, 'Failed to fetch weather data.'),
      }),
    );
});

export default weatherRouter;
