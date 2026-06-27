const PORT = process.env.PORT || 3000;

// Used to build shortUrl in API responses, e.g. http://localhost:3000/abc123
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

module.exports = { PORT, BASE_URL };
