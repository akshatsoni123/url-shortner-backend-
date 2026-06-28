const { pool } = require('../db/postgres');
const { getCachedUrl, setCachedUrl } = require('../cache/urlCache');
const { ttlSecondsUntil } = require('../utils/ttl');

async function getUrlByShortCode(shortCode) {
  const start = performance.now();

  const cachedUrl = await getCachedUrl(shortCode);
  if (cachedUrl) {
    return {
      longUrl: cachedUrl,
      lookupMs: Number((performance.now() - start).toFixed(2)),
      source: 'redis',
    };
  }

  const result = await pool.query(
    `SELECT id, short_code, long_url, expires_at, is_active
     FROM urls
     WHERE short_code = $1`,
    [shortCode]
  );

  const lookupMs = Number((performance.now() - start).toFixed(2));

  if (result.rowCount === 0) {
    const err = new Error('Short URL not found');
    err.statusCode = 404;
    err.lookupMs = lookupMs;
    throw err;
  }

  const row = result.rows[0];

  if (!row.is_active) {
    const err = new Error('This short URL is no longer active');
    err.statusCode = 410;
    err.lookupMs = lookupMs;
    throw err;
  }

  if (row.expires_at && new Date(row.expires_at) < new Date()) {
    const err = new Error('This short URL has expired');
    err.statusCode = 410;
    err.lookupMs = lookupMs;
    throw err;
  }

  const cacheTtl = ttlSecondsUntil(row.expires_at);
  await setCachedUrl(shortCode, row.long_url, cacheTtl);

  return {
    longUrl: row.long_url,
    lookupMs,
    source: 'postgres',
  };
}

module.exports = { getUrlByShortCode };
