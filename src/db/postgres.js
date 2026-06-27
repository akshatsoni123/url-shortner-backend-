// src/db/postgres.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,              // max connections in pool
  idleTimeoutMillis: 30000,
});

async function checkPostgres() {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    return 'up';
  } finally {
    client.release();   // always release back to pool
  }
}

module.exports = { pool, checkPostgres };