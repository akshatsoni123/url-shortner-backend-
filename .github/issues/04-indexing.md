## Learning Goal
Use **database indexing** so redirect lookups stay fast at scale.

## Concepts Covered
- B-tree indexes in PostgreSQL
- Index on lookup column (`short_code`)
- `EXPLAIN ANALYZE` — seq scan vs index scan
- When *not* to over-index

## Tasks
- [ ] Add index: `CREATE INDEX idx_urls_short_code ON urls(short_code);` (or rely on UNIQUE index — document why)
- [ ] Add index on `expires_at` for TTL cleanup queries (Issue #8)
- [ ] Run `EXPLAIN ANALYZE` on lookup query **before** and **after** index
- [ ] Document findings in README or issue comment

## Acceptance Criteria
- Lookup by `short_code` uses Index Scan (or Unique Index Scan) in EXPLAIN
- Before/after query plan screenshots or text pasted in PR
- Understand difference between PK, UNIQUE, and secondary indexes

## Resources
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)

## Depends On
Issue #2 (schema)

## Estimated Effort
~2 hours
