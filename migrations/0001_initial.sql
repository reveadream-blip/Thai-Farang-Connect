-- Thai-Farang-Connect — Cloudflare D1 initial schema

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('investor_thai', 'entrepreneur_farang', 'admin')) NOT NULL,
    full_name TEXT NOT NULL,
    nationality TEXT NOT NULL,
    phone_number TEXT,
    company_name TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    owner_id TEXT REFERENCES users(id),
    title_en TEXT NOT NULL,
    title_th TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_th TEXT NOT NULL,
    industry TEXT NOT NULL,
    location TEXT DEFAULT 'Bangkok',
    required_investment REAL,
    equity_offered REAL DEFAULT 51.0,
    business_plan_url TEXT,
    status TEXT CHECK(status IN ('draft', 'published', 'funded', 'archived')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS connections (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES projects(id),
    investor_id TEXT REFERENCES users(id),
    entrepreneur_id TEXT REFERENCES users(id),
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected', 'legal_review')) DEFAULT 'pending',
    message_init TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS legal_documents (
    id TEXT PRIMARY KEY,
    connection_id TEXT REFERENCES connections(id),
    doc_type TEXT CHECK(doc_type IN ('mou', 'joint_venture_agreement', 'shareholder_pact')),
    file_url TEXT,
    status TEXT CHECK(status IN ('draft', 'signed_thai', 'signed_farang', 'completed')) DEFAULT 'draft',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_location ON projects(location);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
