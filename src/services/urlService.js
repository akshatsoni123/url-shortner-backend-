const { pool } = require('../db/postgres');
const { generateShortCode } = require('../utils/shortCode');
const { validateLongUrl, validateCustomAlias } = require('../utils/urlValidator');
const { setCachedUrl } = require('../cache/urlCache');
const { resolveExpiresAt, ttlSecondsUntil } = require('../utils/ttl');

const MAX_RETRIES = 3;
const PG_UNIQUE_VIOLATION = '23505';

async function createUrl({ longUrl, customAlias, ttlSeconds, expiresAt }) {
  const urlCheck = validateLongUrl(longUrl);
  if (!urlCheck.valid) {
    const err = new Error(urlCheck.error);
    err.statusCode = 400;
    throw err;
  }

  const aliasCheck = validateCustomAlias(customAlias);
  if (!aliasCheck.valid) {
    const err = new Error(aliasCheck.error);
    err.statusCode = 400;
    throw err;
  }

  const ttlCheck = resolveExpiresAt({ ttlSeconds, expiresAt });
  if (!ttlCheck.valid) {
    const err = new Error(ttlCheck.error);
    err.statusCode = 400;
    throw err;
  }

  let shortCode = customAlias || generateShortCode();
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const result = await pool.query(
        `INSERT INTO urls (short_code, long_url, expires_at)
         VALUES ($1, $2, $3)
         RETURNING id, short_code, long_url, expires_at, created_at`,
        [shortCode, longUrl, ttlCheck.expiresAt]
      );

      const row = result.rows[0];
      const cacheTtl = ttlSecondsUntil(row.expires_at);
      await setCachedUrl(row.short_code, row.long_url, cacheTtl);
      return row;
    } catch (error) {
      if (error.code === PG_UNIQUE_VIOLATION) {
        if (customAlias) {
          const err = new Error('Custom alias already taken');
          err.statusCode = 409;
          throw err;
        }

        attempts++;
        shortCode = generateShortCode();
        continue;
      }

      throw error;
    }
  }

  const err = new Error('Could not generate unique short code');
  err.statusCode = 500;
  throw err;
}

module.exports = { createUrl };
