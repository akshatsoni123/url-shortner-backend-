## Learning Goal
Implement **TTL (Time-To-Live)** so URLs can expire in both PostgreSQL and Redis.

## Concepts Covered
- `expires_at` column semantics
- Redis `EXPIRE` / `SETEX` aligned with DB expiry
- Lazy vs proactive expiration
- HTTP 410 Gone for expired links

## Tasks
- [ ] `POST /api/urls` accepts optional `ttlSeconds` or `expiresAt`
- [ ] Store `expires_at` in PostgreSQL
- [ ] Set matching Redis TTL when caching (`SETEX` or `SET` + `EXPIRE`)
- [ ] Redirect handler: reject expired URLs (check DB even on cache hit if needed)
- [ ] Optional cron/scheduled job: mark expired rows inactive

## Acceptance Criteria
- URL with 60s TTL returns 410 after expiry
- Redis key auto-evicts after TTL (verify with `TTL url:code`)
- Expired URL not served from stale cache

## Resources
- [Redis EXPIRE](https://redis.io/docs/latest/commands/expire/)
- TTL alignment between cache and source of truth

## Depends On
Issues #6, #7

## Estimated Effort
~3 hours
