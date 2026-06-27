// src/index.js
require('dotenv').config();
const express = require('express');
const { connectRedis, checkRedis } = require('./cache/redis');
const { checkPostgres } = require('./db/postgres');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', async (req, res) => {
  try {
    const [postgres, redis] = await Promise.all([
      checkPostgres(),
      checkRedis(),
    ]);

    const allUp = postgres === 'up' && redis === 'up';

    res.status(allUp ? 200 : 503).json({
      status: allUp ? 'ok' : 'degraded',
      postgres,
      redis,
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      postgres: 'down',
      redis: 'down',
    });
  }
});

async function start() {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();