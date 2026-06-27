const express = require('express');
const { redirectToLongUrl } = require('../controllers/redirectController');

const router = express.Router();

// GET /gh  →  redirect to long URL
// Must be mounted AFTER /health and /api in app.js
router.get('/:shortCode', redirectToLongUrl);

module.exports = router;