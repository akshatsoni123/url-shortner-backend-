require('dotenv').config();
const { pool } = require('../src/db/postgres');

const LOOKUP_QUERY = `
  EXPLAIN ANALYZE
  SELECT id, short_code, long_url, expires_at, is_active
  FROM urls
  WHERE short_code = $1
`;

const EXPIRY_QUERY = `
  EXPLAIN ANALYZE
  SELECT id, short_code, long_url
  FROM urls
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW()
`;

async function runExplain(label, sql, params = []) {
  console.log(`\n=== ${label} ===\n`);
  const result = await pool.query(sql, params);
  result.rows.forEach((row) => console.log(row['QUERY PLAN']));
}

async function main() {
  await runExplain('Lookup by short_code', LOOKUP_QUERY, ['gh']);
  await runExplain('Expired URLs (TTL cleanup)', EXPIRY_QUERY);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
