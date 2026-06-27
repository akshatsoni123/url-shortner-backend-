## Learning Goal
Build the **read path** — resolve a short code and redirect, measuring DB-only latency as baseline.

## Concepts Covered
- HTTP 301 vs 302 redirects
- Lookup query optimization (uses index from Issue #4)
- Handling missing, expired, and inactive URLs
- Redirect endpoint as highest-traffic route

## Tasks
- [ ] `GET /:shortCode` → lookup in PostgreSQL → `302 Redirect` to `long_url`
- [ ] 404 for unknown code
- [ ] 410 Gone for expired/inactive URLs (prepare for Issue #8)
- [ ] Log lookup duration (console or structured log) for later comparison with Redis

## Acceptance Criteria
- Browser/curl follows redirect correctly
- Unknown code returns 404 JSON or HTML
- Average DB lookup time logged per request

## Depends On
Issue #5

## Estimated Effort
~2–3 hours
