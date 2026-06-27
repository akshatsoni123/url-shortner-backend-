## Learning Goal
Understand how to wire up a local dev stack with **PostgreSQL** (persistent storage) and **Redis** (in-memory cache) before writing application logic.

## Concepts Covered
- Docker Compose multi-service setup
- Environment variables and service health checks
- Connection pooling basics
- Separation of concerns: DB vs cache

## Tasks
- [ ] Initialize backend project (Node.js/Express or your preferred stack)
- [ ] Add `docker-compose.yml` with PostgreSQL 16 and Redis 7
- [ ] Add `.env.example` with `DATABASE_URL`, `REDIS_URL`, `PORT`
- [ ] Verify PostgreSQL connection on startup
- [ ] Verify Redis connection on startup (`PING` → `PONG`)
- [ ] Add a `GET /health` endpoint returning `{ "status": "ok", "postgres": "up", "redis": "up" }`

## Acceptance Criteria
- `docker compose up` starts both services
- App connects to both and `/health` returns 200
- README has setup steps (clone → env → compose → run)

## Resources
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)

## Depends On
_None — start here_

## Estimated Effort
~2–3 hours
