const app = require('./app');
const { connectRedis } = require('./cache/redis');
const { PORT } = require('./config');

async function start() {
  await connectRedis(); // Redis still needed for /health
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();