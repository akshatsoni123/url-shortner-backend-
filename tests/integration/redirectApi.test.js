require('dotenv').config();
const { describe, it, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/db/postgres');

describe('GET /:shortCode redirect', () => {
  const testCodes = [];

  after(async () => {
    for (const code of testCodes) {
      await pool.query('DELETE FROM urls WHERE short_code = $1', [code]);
    }
  });

  it('redirects to long URL for seed code gh', async () => {
    const res = await request(app).get('/gh').expect(302);

    assert.strictEqual(res.headers.location, 'https://github.com');
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
