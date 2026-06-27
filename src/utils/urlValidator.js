const MAX_URL_LENGTH = 2048;

// Custom alias: letters, numbers, hyphen, underscore only
const ALIAS_REGEX = /^[a-zA-Z0-9_-]{3,16}$/;

function validateLongUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  if (url.length > MAX_URL_LENGTH) {
    return { valid: false, error: 'URL is too long' };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, error: 'URL must use http or https' };
  }

  return { valid: true };
}

function validateCustomAlias(alias) {
  if (!alias) {
    return { valid: true }; // optional field
  }

  if (!ALIAS_REGEX.test(alias)) {
    return {
      valid: false,
      error: 'Alias must be 3-16 chars: letters, numbers, _ or -',
    };
  }

  return { valid: true };
}

module.exports = { validateLongUrl, validateCustomAlias, MAX_URL_LENGTH };