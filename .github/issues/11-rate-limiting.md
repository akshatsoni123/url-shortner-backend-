## Learning Goal
Protect the API with **Redis-based rate limiting** — prevent abuse of shorten and stats endpoints.

## Concepts Covered
- Fixed window vs sliding window counters
- Redis `INCR` + `EXPIRE` pattern
- Rate limit headers (`X-RateLimit-Remaining`, `Retry-After`)
- Different limits per endpoint (stricter on POST)

## Tasks
- [ ] Implement middleware: e.g. 10 requests/min per IP on `POST /api/urls`
- [ ] Use Redis key: `ratelimit:{ip}:{endpoint}:{window}`
- [ ] Return 429 Too Many Requests with JSON error body
- [ ] Add rate limit headers to responses
- [ ] Looser limit on `GET /:shortCode` (optional) or skip redirects

## Acceptance Criteria
- 11th request within window returns 429
- Counter resets after window expires
- Rate limiting works across app restarts (Redis-backed, not in-memory)

## Resources
- [Redis rate limiting patterns](https://redis.io/glossary/rate-limiting/)
- Sliding window with sorted sets (stretch goal)

## Depends On
Issue #1 (Redis setup), Issue #5

## Estimated Effort
~3 hours
