const { redis } = require('./redis');

function cacheKey(shortCode) {
  return `url:${shortCode}`;
}

async function getCachedUrl(shortCode) {
  try {
    if (!redis.isOpen) return null;
    return await redis.get(cacheKey(shortCode));
  } catch {
    return null;
  }
}

async function setCachedUrl(shortCode, longUrl, ttlSeconds = null) {
  try {
    if (!redis.isOpen) return;

    const key = cacheKey(shortCode);

    if (ttlSeconds != null && ttlSeconds > 0) {
      await redis.set(key, longUrl, { EX: ttlSeconds });
    } else {
      await redis.set(key, longUrl);
    }
  } catch {
    // ignore
  }
}

async function getCacheTtl(shortCode) {
  try {
    if (!redis.isOpen) return -2;
    return await redis.ttl(cacheKey(shortCode));
  } catch {
    return -2;
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

module.exports = {
  cacheKey,
  getCachedUrl,
  setCachedUrl,
  getCacheTtl,
  deleteCachedUrl,
};
