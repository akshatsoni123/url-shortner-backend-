## Learning Goal
Query and aggregate **analytics data** efficiently using PostgreSQL indexes.

## Concepts Covered
- Aggregation: `COUNT`, `GROUP BY`, date bucketing
- Composite indexes for analytics queries
- Read vs write trade-offs
- API design for stats endpoints

## Tasks
- [ ] Add indexes: `(url_id, clicked_at)`, `(short_code, clicked_at)`
- [ ] `GET /api/urls/:shortCode/stats` → total clicks, clicks today, last clicked
- [ ] `GET /api/analytics/top?limit=10` → most clicked URLs
- [ ] Run `EXPLAIN ANALYZE` on stats queries; document index usage

## Acceptance Criteria
- Stats API returns accurate counts matching raw event rows
- Queries use indexes (not full table scan on large dataset)
- Optional: simple daily breakdown `{ "2026-06-27": 42 }`

## Depends On
Issue #9

## Estimated Effort
~3 hours
