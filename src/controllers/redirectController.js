const { getUrlByShortCode } = require('../services/redirectService');

async function redirectToLongUrl(req, res, next) {
  try {
    const { shortCode } = req.params; // from route GET /:shortCode

    const { longUrl, lookupMs, source } = await getUrlByShortCode(shortCode);

    console.log(`[redirect] shortCode=${shortCode} lookupMs=${lookupMs} source=${source}`);

    // 302 = temporary redirect (browser follows to longUrl)
    res.redirect(302, longUrl);
  } catch (err) {
    // Attach lookup time to error logs if available
    if (err.lookupMs !== undefined) {
      console.log(
        `[redirect] shortCode=${req.params.shortCode} lookupMs=${err.lookupMs} status=${err.statusCode}`
      );
    }
    next(err); // errorHandler sends 404/410 JSON
  }
}

module.exports = { redirectToLongUrl };