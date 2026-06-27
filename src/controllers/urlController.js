const { createUrl } = require('../services/urlService');
const { BASE_URL } = require('../config');

// Idempotency choice: same long URL always gets a NEW short code (no dedup)
async function shortenUrl(req, res, next) {
  try {
    const { url, customAlias } = req.body; // from JSON body: { "url": "...", "customAlias": "..." }

    const row = await createUrl({
      longUrl: url,           // map API field "url" → service field "longUrl"
      customAlias: customAlias,
    });

    // 201 Created — new resource was saved
    res.status(201).json({
      shortCode: row.short_code,
      shortUrl: `${BASE_URL}/${row.short_code}`, // full clickable short link
      longUrl: row.long_url,
    });
  } catch (err) {
    next(err); // pass to errorHandler middleware
  }
}

module.exports = { shortenUrl };