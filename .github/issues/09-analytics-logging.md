## Learning Goal
Capture **click analytics** without slowing down redirects — async event logging.

## Concepts Covered
- Analytics as append-only event stream
- Decoupling redirect (fast) from analytics write (async)
- Schema design for click events
- Fire-and-forget vs queue (start simple)

## Tasks
- [ ] Create `click_events` table:
  - `id`, `url_id` (FK), `short_code`, `clicked_at`
  - `ip_hash` or anonymized IP, `user_agent`, `referrer` (optional)
- [ ] On successful redirect: enqueue/log click without blocking response
- [ ] Use `setImmediate`, background worker, or Redis list as simple queue
- [ ] Batch insert clicks every N seconds (optional optimization)

## Acceptance Criteria
- Redirect response time not significantly increased
- Clicks appear in `click_events` within a few seconds
- At least 5 test clicks recorded correctly

## Depends On
Issue #6

## Estimated Effort
~3 hours
