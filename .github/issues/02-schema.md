## Learning Goal
Design a **PostgreSQL schema** for URL storage using migrations — the foundation every later feature builds on.

## Concepts Covered
- Relational modeling for URL shorteners
- SQL migrations (up/down or versioned files)
- Primary keys, foreign keys, timestamps
- `UNIQUE` constraints (preview for short codes)

## Tasks
- [ ] Create `urls` table:
  - `id` (UUID or BIGSERIAL PK)
  - `short_code` (VARCHAR, NOT NULL, UNIQUE)
  - `long_url` (TEXT, NOT NULL)
  - `created_at`, `updated_at`
  - `expires_at` (nullable — used in Issue #8)
  - `is_active` (BOOLEAN, default true)
- [ ] Add migration tooling (e.g. `node-pg-migrate`, Prisma, Drizzle, or raw SQL)
- [ ] Seed script with 2–3 sample URLs for manual testing

## Acceptance Criteria
- Migration runs cleanly on fresh DB
- Duplicate `short_code` insert fails with unique violation
- Schema diagram or table description in README

## Resources
- [PostgreSQL UNIQUE constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)

## Depends On
Issue #1 (dev environment)

## Estimated Effort
~2–3 hours
