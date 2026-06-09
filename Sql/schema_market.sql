-- ============================================================
-- MDUMENI — Market Intelligence Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── MARKETS ───────────────────────────────────────────────────────────────────
-- Physical markets and buying points across Zimbabwe
CREATE TABLE IF NOT EXISTS markets (
  id            TEXT PRIMARY KEY,          -- e.g. 'MKT_MBARE', 'MKT_GMB_HAR'
  name          TEXT NOT NULL,             -- e.g. 'Mbare Musika'
  type          TEXT NOT NULL              -- 'open_market' | 'gmb_depot' | 'export_buyer' | 'agro_dealer' | 'cooperative'
                CHECK (type IN ('open_market','gmb_depot','export_buyer','agro_dealer','cooperative')),
  province      TEXT NOT NULL,
  district      TEXT NOT NULL,
  lat           NUMERIC(9,6),
  lng           NUMERIC(9,6),
  phone         TEXT,
  min_quantity_kg NUMERIC(10,2) DEFAULT 0, -- minimum quantity they accept
  payment_methods TEXT[],                  -- ['cash','ecocash','bank_transfer','cheque']
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── SUPPLIERS ─────────────────────────────────────────────────────────────────
-- Agro-input suppliers — Windmill, Agrifoods, Seed Co, etc.
CREATE TABLE IF NOT EXISTS suppliers (
  id            TEXT PRIMARY KEY,          -- e.g. 'SUP_WINDMILL_MAR'
  name          TEXT NOT NULL,             -- e.g. 'Windmill Farm Stores'
  branch        TEXT,                      -- e.g. 'Marondera Branch'
  type          TEXT NOT NULL              -- 'agro_dealer' | 'seed_company' | 'fertiliser' | 'equipment'
                CHECK (type IN ('agro_dealer','seed_company','fertiliser','equipment','cooperative')),
  province      TEXT NOT NULL,
  district      TEXT NOT NULL,
  lat           NUMERIC(9,6),
  lng           NUMERIC(9,6),
  phone         TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── MARKET PRICES (crop sell prices) ──────────────────────────────────────────
-- Daily crop sell prices at each market
CREATE TABLE IF NOT EXISTS market_prices (
  id            BIGSERIAL PRIMARY KEY,
  crop_id       TEXT NOT NULL,             -- e.g. 'CROP_001' (maize)
  crop_name     TEXT NOT NULL,
  market_id     TEXT NOT NULL REFERENCES markets(id),
  price_usd_kg  NUMERIC(8,4) NOT NULL,     -- sell price per kg in USD
  price_zwg_kg  NUMERIC(10,2),             -- ZiG equivalent (optional)
  quality_grade TEXT DEFAULT 'standard'   -- 'premium' | 'standard' | 'grade_b'
                CHECK (quality_grade IN ('premium','standard','grade_b')),
  source        TEXT DEFAULT 'manual'      -- 'manual' | 'scraped' | 'crowdsourced' | 'ai_estimate'
                CHECK (source IN ('manual','scraped','crowdsourced','ai_estimate')),
  reporter_id   UUID REFERENCES farmers(id), -- if crowdsourced
  price_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_prices_crop_date
  ON market_prices(crop_id, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_market_prices_market_date
  ON market_prices(market_id, price_date DESC);

-- ── INPUT PRICES ──────────────────────────────────────────────────────────────
-- Daily prices for seeds, fertilisers, chemicals, machinery hire
CREATE TABLE IF NOT EXISTS input_prices (
  id            BIGSERIAL PRIMARY KEY,
  product_id    TEXT NOT NULL,             -- e.g. 'INP_COMPOUND_D_50'
  product_name  TEXT NOT NULL,             -- e.g. 'Compound D 50kg bag'
  category      TEXT NOT NULL             -- 'fertiliser' | 'seed' | 'chemical' | 'machinery' | 'equipment'
                CHECK (category IN ('fertiliser','seed','chemical','machinery','equipment','other')),
  supplier_id   TEXT NOT NULL REFERENCES suppliers(id),
  price_usd     NUMERIC(10,2) NOT NULL,    -- price in USD
  unit          TEXT NOT NULL DEFAULT 'bag', -- 'bag' | 'kg' | 'litre' | 'day' | 'hectare' | 'each'
  unit_size     TEXT,                      -- e.g. '50kg', '1L', '200g'
  is_available  BOOLEAN DEFAULT TRUE,
  source        TEXT DEFAULT 'manual'
                CHECK (source IN ('manual','scraped','crowdsourced','ai_estimate')),
  price_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_input_prices_product_date
  ON input_prices(product_id, price_date DESC);
CREATE INDEX IF NOT EXISTS idx_input_prices_category_date
  ON input_prices(category, price_date DESC);

-- ── PRICE ALERTS ──────────────────────────────────────────────────────────────
-- Farmer-set price alerts — notify when price crosses threshold
CREATE TABLE IF NOT EXISTS price_alerts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id     UUID NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  alert_type    TEXT NOT NULL              -- 'crop_sell' | 'input_buy'
                CHECK (alert_type IN ('crop_sell','input_buy')),
  crop_id       TEXT,                      -- for crop sell alerts
  product_id    TEXT,                      -- for input buy alerts
  condition     TEXT NOT NULL              -- 'above' | 'below'
                CHECK (condition IN ('above','below')),
  threshold_usd NUMERIC(10,4) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRICE REPORTS (crowdsourced) ──────────────────────────────────────────────
-- Farmers report prices from their local markets
CREATE TABLE IF NOT EXISTS price_reports (
  id            BIGSERIAL PRIMARY KEY,
  farmer_id     UUID NOT NULL REFERENCES farmers(id),
  report_type   TEXT NOT NULL              -- 'crop_sell' | 'input_buy'
                CHECK (report_type IN ('crop_sell','input_buy')),
  crop_id       TEXT,
  product_id    TEXT,
  market_id     TEXT REFERENCES markets(id),
  supplier_id   TEXT REFERENCES suppliers(id),
  price_usd     NUMERIC(10,4) NOT NULL,
  unit          TEXT DEFAULT 'kg',
  notes         TEXT,
  is_verified   BOOLEAN DEFAULT FALSE,
  reported_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── VIEWS ─────────────────────────────────────────────────────────────────────

-- Best sell price per crop today across all markets
CREATE OR REPLACE VIEW best_crop_prices_today AS
SELECT DISTINCT ON (mp.crop_id)
  mp.crop_id,
  mp.crop_name,
  mp.price_usd_kg,
  mp.price_date,
  mp.source,
  m.id        AS market_id,
  m.name      AS market_name,
  m.type      AS market_type,
  m.province  AS market_province,
  m.district  AS market_district,
  m.lat, m.lng,
  m.payment_methods,
  m.min_quantity_kg,
  -- 7-day price change
  (mp.price_usd_kg - LAG(mp.price_usd_kg, 7) OVER (
    PARTITION BY mp.crop_id ORDER BY mp.price_date
  )) / NULLIF(LAG(mp.price_usd_kg, 7) OVER (
    PARTITION BY mp.crop_id ORDER BY mp.price_date
  ), 0) * 100 AS change_7d_pct
FROM market_prices mp
JOIN markets m ON m.id = mp.market_id
WHERE mp.price_date >= CURRENT_DATE - INTERVAL '3 days'
  AND m.is_active = TRUE
ORDER BY mp.crop_id, mp.price_usd_kg DESC;

-- Cheapest input per product today across all suppliers
CREATE OR REPLACE VIEW cheapest_inputs_today AS
SELECT DISTINCT ON (ip.product_id)
  ip.product_id,
  ip.product_name,
  ip.category,
  ip.price_usd,
  ip.unit,
  ip.unit_size,
  ip.price_date,
  ip.source,
  s.id        AS supplier_id,
  s.name      AS supplier_name,
  s.branch    AS supplier_branch,
  s.province  AS supplier_province,
  s.district  AS supplier_district,
  s.lat, s.lng,
  s.phone     AS supplier_phone
FROM input_prices ip
JOIN suppliers s ON s.id = ip.supplier_id
WHERE ip.price_date >= CURRENT_DATE - INTERVAL '3 days'
  AND ip.is_available = TRUE
  AND s.is_active = TRUE
ORDER BY ip.product_id, ip.price_usd ASC;

-- ── PERMISSIONS ───────────────────────────────────────────────────────────────
GRANT ALL ON public.markets       TO service_role;
GRANT ALL ON public.suppliers     TO service_role;
GRANT ALL ON public.market_prices TO service_role;
GRANT ALL ON public.input_prices  TO service_role;
GRANT ALL ON public.price_alerts  TO service_role;
GRANT ALL ON public.price_reports TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ── ENABLE RLS ────────────────────────────────────────────────────────────────
ALTER TABLE public.price_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_reports ENABLE ROW LEVEL SECURITY;

-- ── DONE ──────────────────────────────────────────────────────────────────────
-- After running, verify with:
-- SELECT COUNT(*) FROM markets;
-- SELECT COUNT(*) FROM suppliers;
