# URL Shortener Backend

Backend for a URL shortener built with Node.js, Express, PostgreSQL, and Redis.

## Prerequisites

- Node.js 18+
- Docker Desktop

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/akshatsoni123/url-shortner-backend-.git
   cd url-shortner-backend-
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and Redis:
   ```bash
   docker compose up -d
   ```

4. Install dependencies, migrate, and run the app:
   ```bash
   npm install
   npm run db:setup
   npm run dev
   ```

## Database indexes

| Index | Column | Notes |
|-------|--------|-------|
| `urls_pkey` | `id` | Primary key (auto-indexed) |
| `urls_short_code_key` | `short_code` | Auto-created by UNIQUE constraint |
| `idx_urls_expires_at` | `expires_at` | TTL cleanup queries |

Run query plans:

```bash
npm run explain
```

See [docs/indexing/findings.md](docs/indexing/findings.md) for EXPLAIN ANALYZE notes.

## Verify

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "postgres": "up",
  "redis": "up"
}
```

## Stop services

```bash
docker compose down
```
