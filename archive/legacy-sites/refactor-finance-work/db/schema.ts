export const entitlementSchema = `CREATE TABLE IF NOT EXISTS entitlements (
  email TEXT PRIMARY KEY,
  plan TEXT NOT NULL CHECK(plan IN ('essential','pro')),
  status TEXT NOT NULL CHECK(status IN ('active','revoked')),
  transaction_id TEXT,
  product_name TEXT,
  updated_at TEXT NOT NULL
)`;

export const webhookEventSchema = `CREATE TABLE IF NOT EXISTS webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  received_at TEXT NOT NULL
)`;