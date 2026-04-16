-- ═══════════════════════════════════════════════════════════
-- LuandaGov — PostgreSQL Database Schema
-- Civic App for Luanda, Angola
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- for geospatial queries

-- ── Citizens ───────────────────────────────────────────────────
CREATE TABLE citizens (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name     VARCHAR(200) NOT NULL,
    phone         VARCHAR(20)  UNIQUE NOT NULL,
    bi_number     VARCHAR(50)  UNIQUE,
    ward          VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_citizens_phone ON citizens(phone);
CREATE INDEX idx_citizens_ward  ON citizens(ward);

-- ── Report Categories ──────────────────────────────────────────
CREATE TABLE report_categories (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_pt    VARCHAR(100) NOT NULL,
    name_en    VARCHAR(100) NOT NULL,
    icon       VARCHAR(50)  NOT NULL,
    color      VARCHAR(20)  NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- ── Reports ────────────────────────────────────────────────────
CREATE TYPE report_status AS ENUM (
    'submitted', 'under_review', 'in_progress', 'resolved', 'closed', 'rejected'
);

CREATE TABLE reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id  UUID NOT NULL REFERENCES citizens(id),
    category    VARCHAR(50) NOT NULL,
    title       VARCHAR(300) NOT NULL,
    description TEXT,
    status      report_status NOT NULL DEFAULT 'submitted',
    lat         DECIMAL(9,6),
    lng         DECIMAL(9,6),
    location    GEOGRAPHY(POINT, 4326),  -- PostGIS spatial column
    address     TEXT,
    district    VARCHAR(100),
    reference   VARCHAR(50) UNIQUE NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_citizen    ON reports(citizen_id);
CREATE INDEX idx_reports_status     ON reports(status);
CREATE INDEX idx_reports_category   ON reports(category);
CREATE INDEX idx_reports_district   ON reports(district);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_location   ON reports USING GIST(location);  -- spatial index

-- Auto-populate PostGIS column from lat/lng
CREATE OR REPLACE FUNCTION sync_report_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_location
BEFORE INSERT OR UPDATE ON reports
FOR EACH ROW EXECUTE FUNCTION sync_report_location();

-- ── Report Photos ──────────────────────────────────────────────
CREATE TABLE report_photos (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id  UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    url        VARCHAR(500) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_report ON report_photos(report_id);

-- ── Report Updates (status timeline) ──────────────────────────
CREATE TABLE report_updates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id   UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    status      report_status NOT NULL,
    note        TEXT,
    updated_by  VARCHAR(200),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_updates_report ON report_updates(report_id);

-- ── Fee Payments ───────────────────────────────────────────────
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');

CREATE TABLE fee_payments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id  UUID REFERENCES citizens(id),
    fee_type    VARCHAR(100) NOT NULL,
    amount_aoa  INTEGER NOT NULL,
    reference   VARCHAR(50) UNIQUE NOT NULL,
    status      payment_status NOT NULL DEFAULT 'pending',
    paid_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Document Requests ──────────────────────────────────────────
CREATE TYPE doc_request_status AS ENUM ('submitted', 'processing', 'ready', 'delivered', 'rejected');

CREATE TABLE document_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id  UUID REFERENCES citizens(id),
    doc_type    VARCHAR(100) NOT NULL,
    reference   VARCHAR(50) UNIQUE NOT NULL,
    status      doc_request_status NOT NULL DEFAULT 'submitted',
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Push Tokens ────────────────────────────────────────────────
CREATE TABLE push_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id  UUID REFERENCES citizens(id) ON DELETE CASCADE,
    token       VARCHAR(500) UNIQUE NOT NULL,
    platform    VARCHAR(20),
    active      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_push_tokens_citizen ON push_tokens(citizen_id);

-- ── OTP Codes ─────────────────────────────────────────────────
CREATE TABLE otp_codes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone      VARCHAR(20) NOT NULL,
    code_hash  VARCHAR(255) NOT NULL,
    purpose    VARCHAR(50) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auth Sessions ─────────────────────────────────────────────
CREATE TABLE auth_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id          UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    refresh_token_hash  VARCHAR(255) UNIQUE NOT NULL,
    device_info         TEXT,
    expires_at          TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update triggers ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_citizens_updated_at BEFORE UPDATE ON citizens FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reports_updated_at  BEFORE UPDATE ON reports  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Seed: Report Categories ────────────────────────────────────
INSERT INTO report_categories (name_pt, name_en, icon, color, sort_order) VALUES
('Estradas e Pavimentos', 'Roads & Pavements',   'road',          '#F97316', 1),
('Iluminação Pública',    'Public Lighting',      'flashlight',    '#EAB308', 2),
('Água e Saneamento',     'Water & Sanitation',   'water',         '#3B82F6', 3),
('Recolha de Resíduos',   'Waste Collection',     'trash',         '#22C55E', 4),
('Segurança Pública',     'Public Safety',        'shield',        '#EF4444', 5),
('Outros',                'Other',                'alert-circle',  '#8B5CF6', 6);

-- ── Seed: Demo Citizen ─────────────────────────────────────────
INSERT INTO citizens (full_name, phone, bi_number, ward, password_hash) VALUES
('Ana Ferreira', '+244923456789', '005234567LA042', 'Maianga',
 '$2b$12$KIXGTnKvxGhkVYZlmZxlK.changethis_hash_in_production');

-- ── Seed: Sample Reports ───────────────────────────────────────
INSERT INTO reports (citizen_id, category, title, description, status, lat, lng, address, district, reference)
SELECT
    id,
    'road',
    'Buraco na Av. 4 de Fevereiro',
    'Buraco grande na via principal junto ao semáforo. Perigoso para veículos.',
    'in_progress',
    -8.8147, 13.2302,
    'Av. 4 de Fevereiro, Maianga',
    'Maianga',
    'LG-2026-DEMO01'
FROM citizens WHERE phone = '+244923456789'
LIMIT 1;
