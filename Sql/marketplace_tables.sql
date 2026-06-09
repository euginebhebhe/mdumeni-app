-- ============================================================
-- MDUMENI — ZimAgroMarket database tables
-- Run in Supabase SQL editor
-- ============================================================

-- ── marketplace_listings ──────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id                TEXT PRIMARY KEY,
  type              TEXT NOT NULL CHECK (type IN ('selling','buying','input')),
  crop_name         TEXT NOT NULL,
  product_name      TEXT,
  category          TEXT,
  quantity_kg       NUMERIC(10,2) NOT NULL,
  quantity_bags     INTEGER,
  price_usd_kg      NUMERIC(10,4) NOT NULL,
  quality_grade     TEXT NOT NULL DEFAULT 'standard' CHECK (quality_grade IN ('A','B','standard')),
  province          TEXT NOT NULL,
  district          TEXT NOT NULL,
  phone             TEXT NOT NULL,
  farmer_name       TEXT NOT NULL,
  farmer_id         TEXT NOT NULL DEFAULT 'anonymous',
  description       TEXT,
  photo_url         TEXT,
  available_from    TEXT,
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','expired','draft')),
  deal_count        INTEGER NOT NULL DEFAULT 0,
  is_verified_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_pro            BOOLEAN NOT NULL DEFAULT FALSE,
  is_boosted        BOOLEAN NOT NULL DEFAULT FALSE,
  boost_expires_at  TIMESTAMPTZ,
  broadcast_sent    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at        TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days')
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_listings_type     ON marketplace_listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_province ON marketplace_listings(province);
CREATE INDEX IF NOT EXISTS idx_listings_district ON marketplace_listings(district);
CREATE INDEX IF NOT EXISTS idx_listings_crop     ON marketplace_listings(crop_name);
CREATE INDEX IF NOT EXISTS idx_listings_farmer   ON marketplace_listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_status   ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_boosted  ON marketplace_listings(is_boosted, created_at DESC);


-- ── marketplace_deals ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_deals (
  id               TEXT PRIMARY KEY,
  listing_id       TEXT NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  buyer_name       TEXT NOT NULL,
  buyer_phone      TEXT NOT NULL,
  quantity_kg      NUMERIC(10,2) NOT NULL,
  agreed_price     NUMERIC(10,4) NOT NULL,
  buyer_paid       BOOLEAN NOT NULL DEFAULT FALSE,
  seller_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  buyer_rating     TEXT CHECK (buyer_rating IN ('up','down',NULL)),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deals_listing ON marketplace_deals(listing_id);


-- ── marketplace_alerts ────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_alerts (
  id           TEXT PRIMARY KEY,
  farmer_id    TEXT NOT NULL,
  crop_name    TEXT NOT NULL,
  target_price NUMERIC(10,4) NOT NULL,
  province     TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('above','below')),
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_farmer ON marketplace_alerts(farmer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_crop   ON marketplace_alerts(crop_name, province, active);


-- ── marketplace_photos ────────────────────────────────────
-- Photos are stored in Supabase Storage bucket "marketplace-photos"
-- This table is a reference log only
CREATE TABLE IF NOT EXISTS marketplace_photos (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  listing_id TEXT NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  photo_url  TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_listing ON marketplace_photos(listing_id);


-- ── Supabase Storage bucket ───────────────────────────────
-- Run in Supabase dashboard → Storage → New bucket
-- Name: marketplace-photos
-- Public: true (so photo URLs work without auth)
-- File size limit: 5 MB
-- Allowed MIME types: image/jpeg, image/png, image/webp


-- ── Row Level Security (optional but recommended) ────────
-- Enable RLS on listings so farmers can only edit their own
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read active listings
CREATE POLICY "listings_public_read"
  ON marketplace_listings FOR SELECT
  USING (status = 'active');

-- Only the farmer who created can update/delete
-- (requires JWT auth — skip for MVP, enforce in API layer)
-- CREATE POLICY "listings_owner_write"
--   ON marketplace_listings FOR ALL
--   USING (farmer_id = auth.jwt()->>'sub');


-- ── Verify ────────────────────────────────────────────────
-- SELECT COUNT(*) FROM marketplace_listings;
-- SELECT COUNT(*) FROM marketplace_deals;
-- SELECT COUNT(*) FROM marketplace_alerts;
-- \d marketplace_listings
