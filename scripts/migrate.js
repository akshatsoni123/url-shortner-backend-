require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db/postgres');

async function migrate() {
  const dir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.up.sql'))
    .sort();

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    for (const file of files) {
      const applied = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [file]
      );
      if (applied.rowCount > 0) continue;

      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migrations (filename) VALUES ($1)',
        [file]
      );
      await client.query('COMMIT');
      console.log(`Applied: ${file}`);
    }
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});