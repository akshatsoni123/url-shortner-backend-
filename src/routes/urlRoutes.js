const express = require('express');
const { shortenUrl } = require('../controllers/urlController');

const router = express.Router(); // mini-app for URL-related routes

// POST /api/urls  (full path when mounted at /api)
router.post('/urls', shortenUrl);

module.exports = router;