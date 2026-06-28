const { redis } = require('./redis');

function cacheKey(shortCode) {
  return `url:${shortCode}`;
}

async function getCachedUrl(shortCode) {
  try {
    if (!redis.isOpen) return null;
    return await redis.get(cacheKey(shortCode));
  } catch {
    return null; // fallback to Postgres
  }
}

async function setCachedUrl(shortCode, longUrl) {
  try {
    if (!redis.isOpen) return;
    await redis.set(cacheKey(shortCode), longUrl);
  } catch {
    // ignore
  }
}

async function deleteCachedUrl(shortCode) {
  try {
    if (!redis.isOpen) return;
    await redis.del(cacheKey(shortCode));
  } catch {
    // ignore
  }
}

module.exports = { cacheKey, getCachedUrl, setCachedUrl, deleteCachedUrl };