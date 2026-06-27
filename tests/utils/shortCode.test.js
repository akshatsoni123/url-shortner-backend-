const { describe, it } = require('node:test');
const assert = require('node:assert');
const { generateShortCode } = require('../../src/utils/shortCode');

describe('generateShortCode', () => {
  it('generates code of default length 7', () => {
    const code = generateShortCode();
    assert.strictEqual(code.length, 7);
  });

  it('generates 10000 unique codes', () => {
    const codes = new Set();

    for (let i = 0; i < 10000; i++) {
      codes.add(generateShortCode());
    }

    assert.strictEqual(codes.size, 10000);
  });
});