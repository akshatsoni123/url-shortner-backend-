require('dotenv').config();
const { pool } = require('../src/db/postgres');

async function expireUrls() {
  const result = await pool.query(
    `UPDATE urls
     SET is_active = false
     WHERE expires_at IS NOT NULL
       AND expires_at < NOW()
       AND is_active = true
     RETURNING short_code`
  );

  console.log(`Marked ${result.rowCount} expired URL(s) inactive`);
  await pool.end();
}

expireUrls().catch((err) => {
  console.error(err);
  process.exit(1);
});
