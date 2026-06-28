require('dotenv').config();
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/db/postgres');
const { connectRedis, redis } = require('../../src/cache/redis');
const { cacheKey, getCacheTtl } = require('../../src/cache/urlCache');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('TTL / expiration', () => {
  const testCodes = [];

  before(async () => {
    await connectRedis();
  });

  after(async () => {
    for (const code of testCodes) {
      await pool.query('DELETE FROM urls WHERE short_code = $1', [code]);
      await redis.del(cacheKey(code));
    }
  });

  it('creates URL with ttlSeconds and sets Redis TTL', async () => {
    const code = `ttl-redis-${Date.now()}`;

    const res = await request(app)
      .post('/api/urls')
      .send({
        url: 'https://example.com/ttl-test',
        customAlias: code,
        ttlSeconds: 60,
      })
      .expect(201);

    testCodes.push(res.body.shortCode);
    assert.ok(res.body.expiresAt);

    const ttl = await getCacheTtl(res.body.shortCode);
    assert.ok(ttl > 0 && ttl <= 60);
  });

  it('returns 410 after TTL expires and does not serve stale cache', async () => {
    const code = `ttl-exp-${Date.now()}`;

    await request(app)
      .post('/api/urls')
      .send({
        url: 'https://example.com/short-ttl',
        customAlias: code,
        ttlSeconds: 2,
      })
      .expect(201);

    testCodes.push(code);

    await request(app).get(`/${code}`).expect(302);
    await request(app).get(`/${code}`).expect(302);

    await sleep(2500);

    const ttl = await getCacheTtl(code);
    assert.strictEqual(ttl, -2);

    const res = await request(app).get(`/${code}`).expect(410);
    assert.strictEqual(res.body.error, 'This short URL has expired');
  });

  it('returns 400 when ttlSeconds and expiresAt are both provided', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({
        url: 'https://example.com/both-ttl',
        ttlSeconds: 60,
        expiresAt: '2030-01-01T00:00:00.000Z',
      })
      .expect(400);

    assert.ok(res.body.error);
  });
});
