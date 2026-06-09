-- ============================================================
-- MDUMENI — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Enable UUID extension ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── FARMERS ───────────────────────────────────────────────
-- One row per registered farmer
CREATE TABLE IF NOT EXISTS farmers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number    TEXT UNIQUE NOT NULL,         -- e.g. +263771234567
  pin_hash        TEXT NOT NULL,                -- SHA-256 of PIN
  agro_region     INTEGER CHECK (agro_region BETWEEN 1 AND 5),
  farm_size_ha    NUMERIC(8,2),
  has_irrigation  BOOLEAN DEFAULT FALSE,
  budget_level    TEXT CHECK (budget_level IN ('low','medium','high')) DEFAULT 'low',
  language        TEXT CHECK (language IN ('english','shona','ndebele')) DEFAULT 'english',
  province        TEXT,
  district        TEXT,
  is_demo         BOOLEAN DEFAULT FALSE,        -- TRUE for demo/test accounts
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── ACTIVE CROPS ──────────────────────────────────────────
-- Current crop each farmer is growing
CREATE TABLE IF NOT EXISTS active_crops (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id       UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop_id         TEXT NOT NULL,               -- e.g. CROP_001
  crop_name       TEXT NOT NULL,
  planting_date   DATE NOT NULL,
  farm_size_ha    NUMERIC(8,2),
  budget_level    TEXT DEFAULT 'low',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_active_crops_farmer
  ON active_crops(farmer_id) WHERE is_active = TRUE;

-- ── SENSOR READINGS ───────────────────────────────────────
-- Every soil reading — from sensor, web form, or manual entry
CREATE TABLE IF NOT EXISTS sensor_readings (
  id              BIGSERIAL PRIMARY KEY,
  farmer_id       UUID REFERENCES farmers(id) ON DELETE CASCADE,
  device_id       TEXT NOT NULL,               -- 'ESP32-001', 'WEB-INPUT', 'MANUAL'
  soil_ph         NUMERIC(4,2) CHECK (soil_ph BETWEEN 0 AND 14),
  moisture_pct    INTEGER CHECK (moisture_pct BETWEEN 0 AND 100),
  temp_c          NUMERIC(5,2),
  battery_pct     INTEGER,
  recorded_at     TIMESTAMPTZ DEFAULT NOW(),
  source          TEXT DEFAULT 'sensor'        -- 'sensor', 'web-form', 'manual'
);

CREATE INDEX IF NOT EXISTS idx_sensor_farmer_time
  ON sensor_readings(farmer_id, recorded_at DESC);

-- ── SESSION CACHE ─────────────────────────────────────────
-- Stores AI session responses — avoids re-calling engines
CREATE TABLE IF NOT EXISTS session_cache (
  id              BIGSERIAL PRIMARY KEY,
  farmer_id       UUID REFERENCES farmers(id) ON DELETE CASCADE,
  cache_key       TEXT NOT NULL,               -- hash of input params
  response_json   JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cache_farmer_key
  ON session_cache(farmer_id, cache_key);

-- ── SEASON HISTORY ────────────────────────────────────────
-- Completed seasons with actual yield data
CREATE TABLE IF NOT EXISTS season_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id       UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  crop_id         TEXT NOT NULL,
  crop_name       TEXT NOT NULL,
  planting_date   DATE NOT NULL,
  harvest_date    DATE,
  farm_size_ha    NUMERIC(8,2),
  budget_level    TEXT,
  predicted_yield_kg  NUMERIC(10,2),
  actual_yield_kg     NUMERIC(10,2),           -- filled in after harvest
  total_cost_usd      NUMERIC(10,2),
  gross_revenue_usd   NUMERIC(10,2),
  net_profit_usd      NUMERIC(10,2),
  notes               TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────
-- Farmers can only see their own data
ALTER TABLE farmers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_crops    ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_cache   ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_history  ENABLE ROW LEVEL SECURITY;

-- Service role (your FastAPI server) bypasses RLS
-- These policies allow the anon key to do nothing
-- All access goes through your FastAPI server using the service role key

-- ── ADMIN VIEW ────────────────────────────────────────────
-- Aggregate stats for research dashboard
CREATE OR REPLACE VIEW farmer_stats AS
SELECT
  f.id,
  f.phone_number,
  f.province,
  f.district,
  f.agro_region,
  f.farm_size_ha,
  f.budget_level,
  f.created_at,
  (SELECT COUNT(*) FROM sensor_readings sr WHERE sr.farmer_id = f.id) AS reading_count,
  (SELECT MAX(recorded_at) FROM sensor_readings sr WHERE sr.farmer_id = f.id) AS last_reading,
  (SELECT crop_name FROM active_crops ac WHERE ac.farmer_id = f.id AND ac.is_active = TRUE LIMIT 1) AS active_crop,
  (SELECT COUNT(*) FROM season_history sh WHERE sh.farmer_id = f.id) AS seasons_completed
FROM farmers f
WHERE f.is_demo = FALSE;

-- ── DONE ──────────────────────────────────────────────────
-- After running this, go to Settings → API to get your SERVICE ROLE key
-- Add it to Render environment variables as SUPABASE_SERVICE_KEY
