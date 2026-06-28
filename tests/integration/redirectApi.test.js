require('dotenv').config();
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/db/postgres');
const { connectRedis, redis } = require('../../src/cache/redis');
const { cacheKey } = require('../../src/cache/urlCache');

describe('GET /:shortCode redirect', () => {
  const testCodes = [];

  before(async () => {
    await connectRedis();
  });

  after(async () => {
    for (const code of testCodes) {
      await pool.query('DELETE FROM urls WHERE short_code = $1', [code]);
      await redis.del(cacheKey(code));
    }
    await redis.del(cacheKey('gh'));
  });

  it('redirects to long URL for seed code gh', async () => {
    const res = await request(app).get('/gh').expect(302);

    assert.strictEqual(res.headers.location, 'https://github.com');
  });

  it('populates Redis on cache miss and serves from cache on second request', async () => {
    const code = 'cache-test';
    testCodes.push(code);

    await pool.query(
      `INSERT INTO urls (short_code, long_url) VALUES ($1, $2)`,
      [code, 'https://example.com/cached']
    );

    await redis.del(cacheKey(code));

    await request(app).get(`/${code}`).expect(302);
    const cached = await redis.get(cacheKey(code));
    assert.strictEqual(cached, 'https://example.com/cached');

    await request(app).get(`/${code}`).expect(302);
  });

  it('returns 404 for unknown short code', async () => {
    const res = await request(app).get('/does-not-exist-xyz').expect(404);

    assert.strictEqual(res.body.error, 'Short URL not found');
  });

  it('returns 410 for inactive URL', async () => {
    const code = 'inactive-test';
    testCodes.push(code);

    await pool.query(
      `INSERT INTO urls (short_code, long_url, is_active)
       VALUES ($1, $2, false)`,
      [code, 'https://example.com/inactive']
    );

    const res = await request(app).get(`/${code}`).expect(410);
    assert.strictEqual(res.body.error, 'This short URL is no longer active');
  });

  it('returns 410 for expired URL', async () => {
    const code = 'expired-test';
    testCodes.push(code);

    await pool.query(
      `INSERT INTO urls (short_code, long_url, expires_at)
       VALUES ($1, $2, NOW() - INTERVAL '1 hour')`,
      [code, 'https://example.com/expired']
    );

    const res = await request(app).get(`/${code}`).expect(410);
    assert.strictEqual(res.body.error, 'This short URL has expired');
  });
});
