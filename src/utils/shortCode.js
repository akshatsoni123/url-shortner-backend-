const crypto = require('crypto');

// Characters safe for URLs: a-z, A-Z, 0-9 (Base62)
const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const DEFAULT_LENGTH = 7;

function generateShortCode(length = DEFAULT_LENGTH) {
  let code = '';

  for (let i = 0; i < length; i++) {
    // crypto.randomInt picks a secure random index
    const randomIndex = crypto.randomInt(0, CHARSET.length);
    code += CHARSET[randomIndex];
  }

  return code;
}

module.exports = { generateShortCode, CHARSET, DEFAULT_LENGTH };