# NewsAgg Docker Guide

## Services

`docker-compose.yml` sekarang menjalankan:

1. `server` (Express + PostgreSQL/Neon) di port `3000` (default host port, bisa diubah)
2. `client` (Nginx static frontend) di port `8080`

## Required environment

Docker Compose akan membaca environment dari file di bawah ini.

### `server/.env`

Minimal isi:

```env
API_KEY=your_newsapi_key
DATABASE_URL=your_neon_postgres_url
NEON_DSN=your_neon_postgres_url
```

### `server/.hf.env`

Dipakai scraper Python:

```env
HF_TOKEN=your_huggingface_token
```

 Docker Compose Build Steps

  1. Verify server/.env has all required keys

  Open server/.env and make sure these are filled in (not empty):
  NEONDB_URL=postgresql://...        ← must be set
  JWT_SECRET=...                     ← must be set
  Everything else (Groq, Gemini, etc.) is optional for the app to start.

  2. Build and start (from the project root)

  docker compose up --build
  This builds server + client images and starts both. First build takes ~3–5 minutes.

  3. Access the app

  ┌──────────────┬──────────────────────────────┐
  │   Service    │             URL              │
  ├──────────────┼──────────────────────────────┤
  │ Client (app) │ http://localhost:8080        │
  ├──────────────┼──────────────────────────────┤
  │ Server API   │ http://localhost:3000        │
  ├──────────────┼──────────────────────────────┤
  │ Health check │ http://localhost:3000/health │
  └──────────────┴──────────────────────────────┘

  4. To stop

  docker compose down

  5. Run the scraper (optional, separate profile)

  docker compose --profile scraper run --rm scraper

  ---
  Common issues

  │ Server API   │ http://localhost:3000        │
  ├──────────────┼──────────────────────────────┤
  │ Health check │ http://localhost:3000/health │
  └──────────────┴──────────────────────────────┘

  4. To stop

  docker compose down

  5. Run the scraper (optional, separate profile)

  docker compose --profile scraper run --rm scraper

  ---
  Common issues

  "Cannot connect to Docker daemon" — Make sure Docker Desktop is running first.

  Client shows blank/error — Check that NEONDB_URL is set in server/.env. Run docker compose logs server to see the error.

  Rebuild after code changes — Always add --build flag: docker compose up --build

  Port conflict — If 3000 or 8080 are taken, change the left-side ports in docker-compose.yml (e.g. "3001:3000").
