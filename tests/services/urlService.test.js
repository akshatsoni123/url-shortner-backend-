const { describe, it } = require('node:test');
const assert = require('node:assert');
const { validateLongUrl, validateCustomAlias } = require('../../src/utils/urlValidator');

describe('urlValidator', () => {
  it('rejects invalid URL', () => {
    const result = validateLongUrl('not-a-url');
    assert.strictEqual(result.valid, false);
  });

  it('rejects ftp URL', () => {
    const result = validateLongUrl('ftp://files.com');
    assert.strictEqual(result.valid, false);
  });

  it('accepts https URL', () => {
    const result = validateLongUrl('https://google.com');
    assert.strictEqual(result.valid, true);
  });

  it('rejects bad alias with spaces', () => {
    const result = validateCustomAlias('bad alias!');
    assert.strictEqual(result.valid, false);
  });

  it('accepts good alias', () => {
    const result = validateCustomAlias('my-link');
    assert.strictEqual(result.valid, true);
  });
});