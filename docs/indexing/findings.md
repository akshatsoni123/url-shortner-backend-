# Indexing Findings — Issue #4

## What we implemented

Migration `002_add_indexes.up.sql` adds a secondary index on `expires_at` for future TTL cleanup queries (Issue #8).

We did **not** add a separate index on `short_code` because migration `001` already defines:

```sql
short_code VARCHAR(16) NOT NULL UNIQUE
```

PostgreSQL automatically creates `urls_short_code_key` for UNIQUE constraints.

## Lookup by short_code (redirect query)

```sql
SELECT id, short_code, long_url, expires_at, is_active
FROM urls
WHERE short_code = 'gh';
```

- **Index used:** `urls_short_code_key` (Unique Index Scan)
- **Why no extra index:** UNIQUE already creates a B-tree index; a second index on the same column would be redundant and slow down writes.

## Expired URLs query (TTL cleanup)

```sql
SELECT id, short_code, long_url
FROM urls
WHERE expires_at IS NOT NULL AND expires_at < NOW();
```

- **Before migration 002:** Seq Scan (no index on `expires_at`)
- **After migration 002:** `idx_urls_expires_at` exists; Index Scan is used at scale

## Seq Scan vs Index Scan

| Plan | Meaning | When |
|------|---------|------|
| **Seq Scan** | Read every row in the table | Small tables, or no useful index |
| **Index Scan** | Jump to matching rows via B-tree | Large tables with a matching index |

**Important:** With only 3 seed rows, PostgreSQL's planner may still choose Seq Scan because reading the whole tiny table is faster than using an index. Indexes matter when the table grows to thousands/millions of rows.

Verify indexes exist:

```bash
docker exec urlshortener-postgres psql -U urlshortener -d urlshortener -c "\d urls"
```

Run explain plans:

```bash
npm run explain
```

## Index types in our schema

| Index | Column | Type | Purpose |
|-------|--------|------|---------|
| `urls_pkey` | `id` | PRIMARY KEY | Row identity; auto-indexed |
| `urls_short_code_key` | `short_code` | UNIQUE | Fast redirect lookup + no duplicate codes |
| `idx_urls_expires_at` | `expires_at` | Secondary | Fast TTL / expiry cleanup queries |

## When NOT to over-index

- Do not index every column — each index adds write overhead on INSERT/UPDATE
- Do not duplicate indexes (e.g. UNIQUE + separate index on same column)
- Index columns that appear in WHERE clauses on hot paths (`short_code`, `expires_at`)
