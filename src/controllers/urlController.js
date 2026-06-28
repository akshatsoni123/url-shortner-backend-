const { createUrl } = require('../services/urlService');
const { BASE_URL } = require('../config');

async function shortenUrl(req, res, next) {
  try {
    const { url, customAlias, ttlSeconds, expiresAt } = req.body;

    const row = await createUrl({
      longUrl: url,
      customAlias: customAlias,
      ttlSeconds: ttlSeconds,
      expiresAt: expiresAt,
    });

    res.status(201).json({
      shortCode: row.short_code,
      shortUrl: `${BASE_URL}/${row.short_code}`,
      longUrl: row.long_url,
      expiresAt: row.expires_at,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { shortenUrl };
