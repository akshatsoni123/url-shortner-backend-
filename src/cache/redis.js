// src/cache/redis.js
const { createClient } = require('redis');

const redis = createClient({ url: process.env.REDIS_URL });

redis.on('error', (err) => console.error('Redis error:', err));

async function connectRedis() {
  if (!redis.isOpen) await redis.connect();
}

async function checkRedis() {
  const pong = await redis.ping();
  return pong === 'PONG' ? 'up' : 'down';
}

module.exports = { redis, connectRedis, checkRedis };