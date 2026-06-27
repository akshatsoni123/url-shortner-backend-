## Learning Goal
Build the **write path** — create short URLs via REST API using PostgreSQL only (no Redis yet).

## Concepts Covered
- REST API design (`POST /api/urls`)
- Request validation and error responses
- Transaction basics (single INSERT)
- Idempotency awareness (same long URL → new code or existing? — pick one, document it)

## Tasks
- [ ] `POST /api/urls` body: `{ "url": "https://...", "customAlias": "optional" }`
- [ ] Response 201: `{ "shortCode": "abc123", "shortUrl": "http://localhost:3000/abc123", "longUrl": "..." }`
- [ ] Handle 400 (validation), 409 (alias taken), 500 (DB errors)
- [ ] Integration test: create URL → verify row in DB

## Acceptance Criteria
- curl/Postman example works end-to-end
- Row persisted in `urls` table
- No Redis usage in this ticket (intentional — compare latency later)

## Depends On
Issues #3, #4

## Estimated Effort
~3 hours
