CREATE TABLE urls (
  id          BIGSERIAL PRIMARY KEY,
  short_code  VARCHAR(16)  NOT NULL UNIQUE,
  long_url    TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE
);