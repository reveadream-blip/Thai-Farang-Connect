-- Demandes de contact / leads (sans auth pour l’instant)

CREATE TABLE IF NOT EXISTS lead_intents (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT CHECK(role IN ('investor_thai', 'entrepreneur_farang')) NOT NULL,
    locale TEXT,
    message TEXT,
    project_id TEXT REFERENCES projects(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lead_created ON lead_intents(created_at);
