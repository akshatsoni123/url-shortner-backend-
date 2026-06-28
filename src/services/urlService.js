const { pool } = require('../db/postgres');
const { generateShortCode } = require('../utils/shortCode');
const { validateLongUrl, validateCustomAlias } = require('../utils/urlValidator');
const { setCachedUrl } = require('../cache/urlCache');

const MAX_RETRIES = 3;
const PG_UNIQUE_VIOLATION = '23505'; // PostgreSQL error code for UNIQUE fail

async function createUrl({ longUrl, customAlias }) {
  // 1. Validate input
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

  // 2. Use custom alias OR auto-generate
  let shortCode = customAlias || generateShortCode();
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const result = await pool.query(
        `INSERT INTO urls (short_code, long_url)
         VALUES ($1, $2)
         RETURNING id, short_code, long_url, created_at`,
        [shortCode, longUrl]
      );

      const row = result.rows[0];
      await setCachedUrl(row.short_code, row.long_url);
      return row;    } catch (error) {
      // 3. Handle duplicate short_code
      if (error.code === PG_UNIQUE_VIOLATION) {
        // Custom alias taken → don't retry, return 409
        if (customAlias) {
          const err = new Error('Custom alias already taken');
          err.statusCode = 409;
          throw err;
        }

        // Auto-generated code collided → try new code
        attempts++;
        shortCode = generateShortCode();
        continue;
      }

      throw error; // unknown DB error
    }
  }

  const err = new Error('Could not generate unique short code');
  err.statusCode = 500;
  throw err;
}

module.exports = { createUrl };