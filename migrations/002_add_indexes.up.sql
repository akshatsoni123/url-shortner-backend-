-- short_code already has UNIQUE in migration 001, which auto-creates urls_short_code_key.
-- No separate index on short_code is needed (would be redundant).

CREATE INDEX idx_urls_expires_at ON urls (expires_at);
