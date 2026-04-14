# RFS Weather

RFS Weather is a full-stack weather application built as a Junior Full Stack technical assessment. It provides city search with autocomplete, current conditions, and a five-day forecast through a React frontend and an Express backend that proxies the Open-Meteo APIs.

The project is structured as a `pnpm` monorepo with separate `client` and `server` applications, shared TypeScript contracts, and a lightweight backend proxy layer that keeps the frontend decoupled from third-party API details.

## Project Overview

The application is designed to demonstrate:

- full-stack TypeScript development
- a clear separation between frontend and backend responsibilities
- typed integration with an external weather provider
- thoughtful UI composition using modern React patterns
- maintainable request and state management on the client

At a high level:

- `client/` contains a React + Vite frontend styled with Tailwind and shadcn-style components
- `server/` contains an Express API that handles city search and weather retrieval
- `shared/` contains shared weather-related TypeScript contracts used by both applications

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn-style UI components
- Backend: Node.js, Express, TypeScript
- Data fetching: TanStack Query
- External API: Open-Meteo geocoding and forecast APIs
- Package manager: `pnpm`

## Project Structure

```text
rfs-project-demo/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
├── server/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
├── shared/
│   └── weather.types.ts
└── pnpm-workspace.yaml
```

## Local Startup

### Prerequisites

- Node.js 20+ recommended
- `pnpm` installed globally

### Install Dependencies

From the repository root:

```bash
pnpm install
```

### Run Both Applications

Run the backend and frontend in separate terminal tabs from the repository root.

Terminal 1:

```bash
pnpm --filter server dev
```

Terminal 2:

```bash
pnpm --filter client dev
```

Expected local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Build Commands

```bash
pnpm --filter server build
pnpm --filter client build
```

## API Endpoints

The backend exposes a small proxy surface for the frontend:

- `GET /api/health`
- `GET /api/weather/search?q={city}`
- `GET /api/weather/current?lat={lat}&lng={lng}&timezone={timezone}&city={city}&country={country}&region={region}`

## Environment Variables

No API keys are required. The application uses Open-Meteo, which provides free geocoding and forecast access without authentication.

The frontend reads one optional environment variable:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001` | Base URL of the backend API |

To override it, copy `.env.example` to `.env` in the repository root and set the value before starting the client:

```bash
cp .env.example .env
# edit .env if needed, then:
pnpm --filter client dev
```

## Technical Decisions

### Why Express with the Router Pattern

The backend uses Express with a router-and-service split to keep responsibilities narrow and easy to reason about. Route handlers focus on request validation and HTTP responses, while the weather service contains the upstream API logic and response normalization.

This is a practical structure for an assessment because it is simple to follow, but still demonstrates production-minded organization. It scales better than placing all logic in a single server entrypoint and makes future additions such as more routes, middleware, or tests easier to introduce.

### Why Open-Meteo

Open-Meteo is a strong fit for this assessment because it is free to use, does not require an API key, and supports both geocoding and weather forecast retrieval. That reduces setup complexity while still allowing the project to demonstrate real API integration, backend proxying, and typed response handling.

It also avoids unnecessary friction for reviewers, since they can clone the project and run it immediately without any credential provisioning.

### Why Strict TypeScript

Strict TypeScript improves confidence across the full stack by forcing clearer contracts between the backend, frontend, and external API responses. In this project, the shared weather types reduce duplication and help ensure that both applications agree on the same data shapes.

For an assessment setting, this is particularly valuable because it demonstrates attention to correctness, maintainability, and developer ergonomics rather than relying on loosely typed request and response handling.

### Why shadcn/Tailwind

I have used Tailwind for long enough that it has become my default choice when I want to move quickly without losing control of the final look and feel. It keeps styling close to the component layer, makes iteration fast, and avoids the overhead of maintaining large custom stylesheet structures as the UI grows.

I also prefer the shadcn-style component approach because it gives me a polished baseline without locking the project into a heavy abstraction. The components stay understandable, the styling remains easy to adapt, and it is straightforward to build a modern interface that still feels maintainable over time.

## Frontend Notes

The frontend includes:

- a city autocomplete search component
- URL persistence for the selected city so reloads can recover state
- TanStack Query for caching and request lifecycle management
- loading skeletons, error states, and responsive weather display components

Weather search results are debounced and cached locally for a short period to reduce unnecessary network traffic and improve repeated interactions.

## Backend Notes

The backend:

- validates incoming query parameters
- proxies requests to Open-Meteo
- normalizes weather and city data for the client
- returns `400` responses for invalid client input
- returns `502` responses for upstream API failures

This keeps third-party API concerns out of the frontend and provides a stable internal contract for the React app.

## Shared Types

Shared weather contracts live in:

- `shared/weather.types.ts`

The frontend and backend each re-export those types through their local type entrypoints, so both applications use a single source of truth for weather-related interfaces.

## Troubleshooting

If `tsc` is not found during a build, dependencies were likely not installed correctly. Reinstall from the repository root:

```bash
rm -rf client/node_modules server/node_modules
pnpm install
pnpm --filter server build
pnpm --filter client build
```
