require('dotenv').config();
const express = require('express');
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middleware/errorHandler');
const { checkPostgres } = require('./db/postgres');
const { checkRedis } = require('./cache/redis');
const redirectRoutes = require('./routes/redirectRoutes');
const app = express();

app.use(express.json()); // parse JSON bodies → req.body (required for POST)

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

app.use('/api', urlRoutes); // all routes in urlRoutes.js live under /api
app.use(redirectRoutes);

app.use(errorHandler); // must be LAST — catches errors from routes above

module.exports = app;