require('dotenv').config();
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/db/postgres');

describe('POST /api/urls', () => {
  let createdShortCode;

  after(async () => {
    // cleanup test row so tests can re-run
    if (createdShortCode) {
      await pool.query('DELETE FROM urls WHERE short_code = $1', [createdShortCode]);
    }
    await pool.end();
  });

  it('creates a short URL and persists to DB', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ url: 'https://example.com/test-integration' })
      .expect(201);

    assert.ok(res.body.shortCode);
    assert.ok(res.body.shortUrl.includes(res.body.shortCode));
    assert.strictEqual(res.body.longUrl, 'https://example.com/test-integration');

    createdShortCode = res.body.shortCode;

    // verify row actually exists in PostgreSQL
    const dbResult = await pool.query(
      'SELECT short_code, long_url FROM urls WHERE short_code = $1',
      [createdShortCode]
    );
    assert.strictEqual(dbResult.rowCount, 1);
  });

  it('returns 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ url: 'not-a-url' })
      .expect(400);

    assert.ok(res.body.error);
  });

  it('returns 409 for duplicate custom alias', async () => {
    const res = await request(app)
      .post('/api/urls')
      .send({ url: 'https://google.com', customAlias: 'gh' }) // 'gh' from seed
      .expect(409);

    assert.ok(res.body.error);
  });
});