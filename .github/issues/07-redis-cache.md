## Learning Goal
Add **Redis caching** using the cache-aside pattern to speed up redirects.

## Concepts Covered
- Cache-aside (lazy loading): read cache → miss → read DB → write cache
- Redis `GET` / `SET` with JSON or plain string values
- Cache key naming: `url:{shortCode}` → `long_url`
- Cache invalidation on URL update/delete

## Tasks
- [ ] On redirect: check Redis first; on miss, query PostgreSQL and populate cache
- [ ] On new URL create: optionally warm cache
- [ ] On URL deactivate/delete: delete cache key
- [ ] Compare logged latency: DB-only vs cache hit (document ~10x improvement expectation)
- [ ] Handle Redis down gracefully (fallback to PostgreSQL)

## Acceptance Criteria
- Second request for same code is served from Redis (verify with Redis CLI `GET url:abc123`)
- Cache miss populates Redis automatically
- App works if Redis is temporarily unavailable

## Resources
- [Redis GET/SET](https://redis.io/docs/latest/commands/get/)
- Cache-aside pattern

## Depends On
Issue #6

## Estimated Effort
~3 hours
