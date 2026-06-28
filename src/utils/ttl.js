// Accept ttlSeconds (relative) OR expiresAt (absolute ISO string)
function resolveExpiresAt({ ttlSeconds, expiresAt }) {
  if (ttlSeconds != null && expiresAt != null) {
    return { valid: false, error: 'Provide ttlSeconds or expiresAt, not both' };
  }

  if (ttlSeconds != null) {
    const seconds = Number(ttlSeconds);
    if (!Number.isInteger(seconds) || seconds <= 0) {
      return { valid: false, error: 'ttlSeconds must be a positive integer' };
    }
    return { valid: true, expiresAt: new Date(Date.now() + seconds * 1000) };
  }

  if (expiresAt != null) {
    const date = new Date(expiresAt);
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      return { valid: false, error: 'expiresAt must be a valid future datetime' };
    }
    return { valid: true, expiresAt: date };
  }

  return { valid: true, expiresAt: null };
}

function ttlSecondsUntil(expiresAt) {
  if (!expiresAt) return null;
  const seconds = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
  return seconds > 0 ? seconds : 0;
}

module.exports = { resolveExpiresAt, ttlSecondsUntil };
