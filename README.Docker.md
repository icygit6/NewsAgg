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

## Run

Dari root repository:

```bash
docker compose up --build
```

Lalu buka:

- Frontend: `http://localhost:8080`
- Server API: `http://localhost:3000` (atau port yang kamu set)

## Optional overrides

Kalau port `3000` sudah dipakai, set host port lain dan sesuaikan API URL:

```env
SERVER_HOST_PORT=3001
VITE_API_URL=http://localhost:3001
```

Kamu bisa set ini lewat environment shell atau file `.env` di root project sebelum menjalankan Compose.

## Notes

- Tidak ada lagi dependency MongoDB pada stack ini.
- Root `Dockerfile` build backend image dari root context.
- `server/Dockerfile` expose port `3000` sesuai `server.js`.
