// scripts/seed.js
require('dotenv').config();
const { pool } = require('../src/db/postgres');

const samples = [
  { short_code: 'gh', long_url: 'https://github.com' },
  { short_code: 'google', long_url: 'https://google.com' },
  { short_code: 'temp', long_url: 'https://example.com', expires_at: null },
];

async function seed() {
  for (const row of samples) {
    await pool.query(
      `INSERT INTO urls (short_code, long_url)
       VALUES ($1, $2)
       ON CONFLICT (short_code) DO NOTHING`,
      [row.short_code, row.long_url]
    );
  }
  console.log('Seed complete');
  await pool.end();
}

seed().catch(console.error);