## Learning Goal
Generate **unique short codes** safely — the core identity of every shortened URL.

## Concepts Covered
- Base62 / nanoid / hash-based encoding
- Collision detection and retry logic
- Database-enforced uniqueness as safety net
- URL-safe character sets

## Tasks
- [ ] Implement `generateShortCode()` (target length 6–8 chars)
- [ ] On insert: if unique violation → regenerate (max 3 retries)
- [ ] Validate `long_url` (must be http/https, max length)
- [ ] Optional: support custom alias via request body (validate charset + uniqueness)
- [ ] Unit tests for generator + collision retry

## Acceptance Criteria
- 10,000 generated codes have no duplicates in unit tests
- Invalid URLs rejected with 400
- Custom alias conflicts return 409

## Resources
- [Base62 encoding](https://en.wikipedia.org/wiki/Base62)
- Collision handling: DB UNIQUE + app retry pattern

## Depends On
Issue #2 (schema)

## Estimated Effort
~3 hours
