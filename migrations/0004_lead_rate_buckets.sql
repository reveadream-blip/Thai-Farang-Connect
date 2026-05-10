-- Compteurs pour limitation POST /v1/leads (fenêtre ~1 min dans la clé bucket).

CREATE TABLE IF NOT EXISTS lead_rate_buckets (
    bucket TEXT PRIMARY KEY,
    hits INTEGER NOT NULL DEFAULT 1
);
