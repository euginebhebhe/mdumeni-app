// src/db/database.ts
// SQLite layer using expo-sqlite with modern useSQLiteContext API
// Version-based migrations, WAL mode, typed queries

import { type SQLiteDatabase } from 'expo-sqlite';
import type {
  FarmerProfile,
  ActiveCrop,
  SensorReading,
  ResponseCache,
} from '@/types';

// ── Schema version — bump this when adding/changing tables ───────────────────
const SCHEMA_VERSION = 1;

// ── Migration function — called by SQLiteProvider onInit ─────────────────────
export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  // Enable WAL mode first — concurrent reads while writing, essential for BLE
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA synchronous = NORMAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Get current schema version
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= SCHEMA_VERSION) return;

  // ── V1: Initial schema ────────────────────────────────────────────────────
  if (currentVersion < 1) {
    await db.execAsync(`
      -- Farmer profile (always exactly one row, id=1)
      CREATE TABLE IF NOT EXISTS farmer_profile (
        id              INTEGER PRIMARY KEY DEFAULT 1,
        agro_region     INTEGER NOT NULL DEFAULT 2,
        farm_size_ha    REAL    NOT NULL DEFAULT 1.0,
        has_irrigation  INTEGER NOT NULL DEFAULT 0,
        budget_level    TEXT    NOT NULL DEFAULT 'low',
        language        TEXT    NOT NULL DEFAULT 'english',
        province        TEXT    NOT NULL DEFAULT '',
        district        TEXT    NOT NULL DEFAULT '',
        updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      -- Sensor readings — rolling history, synced to server when online
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id   TEXT    NOT NULL,
        soil_ph     REAL    NOT NULL,
        moisture_pct INTEGER NOT NULL,
        temp_c      REAL    NOT NULL,
        battery_pct INTEGER NOT NULL DEFAULT 100,
        signal_rssi INTEGER,
        recorded_at TEXT    NOT NULL DEFAULT (datetime('now')),
        is_synced   INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_sensor_device_time
        ON sensor_readings(device_id, recorded_at DESC);
      CREATE INDEX IF NOT EXISTS idx_sensor_unsynced
        ON sensor_readings(is_synced) WHERE is_synced = 0;

      -- Active crop — what is planted right now
      CREATE TABLE IF NOT EXISTS active_crops (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        crop_id       TEXT    NOT NULL,
        crop_name     TEXT    NOT NULL,
        planting_date TEXT    NOT NULL,
        farm_size_ha  REAL    NOT NULL,
        budget_level  TEXT    NOT NULL DEFAULT 'low',
        is_active     INTEGER NOT NULL DEFAULT 1
      );

      -- Response cache — offline fallback for /session API calls
      CREATE TABLE IF NOT EXISTS response_cache (
        key        TEXT PRIMARY KEY,
        data       TEXT NOT NULL,
        cached_at  TEXT NOT NULL DEFAULT (datetime('now')),
        expires_at TEXT NOT NULL
      );

      -- Seed default farmer profile
      INSERT OR IGNORE INTO farmer_profile (id) VALUES (1);
    `);

    // Bump schema version
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  }
}

// ── Typed query helpers ───────────────────────────────────────────────────────

// Farmer profile
export async function getProfile(db: SQLiteDatabase): Promise<FarmerProfile | null> {
  const row = await db.getFirstAsync<FarmerProfile>(
    'SELECT * FROM farmer_profile WHERE id = 1'
  );
  if (!row) return null;
  return { ...row, has_irrigation: Boolean(row.has_irrigation) };
}

export async function saveProfile(
  db: SQLiteDatabase,
  profile: Partial<FarmerProfile>
): Promise<void> {
  const fields = Object.keys(profile) as (keyof FarmerProfile)[];
  const setClauses = fields.map(f => `${f} = ?`).join(', ');
  const values = fields.map(f => {
    const v = profile[f];
    if (typeof v === 'boolean') return v ? 1 : 0;
    return v;
  });
  await db.runAsync(
    `UPDATE farmer_profile SET ${setClauses}, updated_at = datetime('now') WHERE id = 1`,
    values
  );
}

// Sensor readings
export async function insertReading(
  db: SQLiteDatabase,
  reading: Omit<SensorReading, 'id'>
): Promise<void> {
  await db.runAsync(
    `INSERT INTO sensor_readings
      (device_id, soil_ph, moisture_pct, temp_c, battery_pct, signal_rssi, recorded_at, is_synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      reading.device_id,
      reading.soil_ph,
      reading.moisture_pct,
      reading.temp_c,
      reading.battery_pct,
      reading.signal_rssi ?? null,
      reading.recorded_at,
    ]
  );
  // Keep only last 30 days of readings to manage storage
  await db.runAsync(
    `DELETE FROM sensor_readings
     WHERE recorded_at < datetime('now', '-30 days')`
  );
}

export async function getLatestReading(
  db: SQLiteDatabase
): Promise<SensorReading | null> {
  return db.getFirstAsync<SensorReading>(
    `SELECT * FROM sensor_readings ORDER BY recorded_at DESC LIMIT 1`
  );
}

export async function getReadingHistory(
  db: SQLiteDatabase,
  days = 7
): Promise<SensorReading[]> {
  return db.getAllAsync<SensorReading>(
    `SELECT * FROM sensor_readings
     WHERE recorded_at >= datetime('now', '-${days} days')
     ORDER BY recorded_at ASC`
  );
}

export async function getUnsyncedReadings(
  db: SQLiteDatabase
): Promise<SensorReading[]> {
  return db.getAllAsync<SensorReading>(
    `SELECT * FROM sensor_readings WHERE is_synced = 0 ORDER BY recorded_at ASC LIMIT 100`
  );
}

export async function markReadingsSynced(
  db: SQLiteDatabase,
  ids: number[]
): Promise<void> {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => '?').join(',');
  await db.runAsync(
    `UPDATE sensor_readings SET is_synced = 1 WHERE id IN (${placeholders})`,
    ids
  );
}

// Active crop
export async function getActiveCrop(
  db: SQLiteDatabase
): Promise<ActiveCrop | null> {
  return db.getFirstAsync<ActiveCrop>(
    `SELECT * FROM active_crops WHERE is_active = 1 ORDER BY id DESC LIMIT 1`
  );
}

export async function setActiveCrop(
  db: SQLiteDatabase,
  crop: Omit<ActiveCrop, 'id'>
): Promise<void> {
  // Deactivate all existing
  await db.runAsync(`UPDATE active_crops SET is_active = 0`);
  await db.runAsync(
    `INSERT INTO active_crops (crop_id, crop_name, planting_date, farm_size_ha, budget_level, is_active)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [crop.crop_id, crop.crop_name, crop.planting_date, crop.farm_size_ha, crop.budget_level]
  );
}

// Response cache
export async function setCacheEntry(
  db: SQLiteDatabase,
  key: string,
  data: unknown,
  ttlSeconds = 86400 // 24h default
): Promise<void> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
  await db.runAsync(
    `INSERT OR REPLACE INTO response_cache (key, data, cached_at, expires_at)
     VALUES (?, ?, datetime('now'), ?)`,
    [key, JSON.stringify(data), expiresAt.toISOString()]
  );
}

export async function getCacheEntry<T>(
  db: SQLiteDatabase,
  key: string
): Promise<T | null> {
  const row = await db.getFirstAsync<ResponseCache>(
    `SELECT * FROM response_cache
     WHERE key = ? AND expires_at > datetime('now')`,
    [key]
  );
  if (!row) return null;
  try {
    return JSON.parse(row.data) as T;
  } catch {
    return null;
  }
}

export async function clearExpiredCache(db: SQLiteDatabase): Promise<void> {
  await db.runAsync(
    `DELETE FROM response_cache WHERE expires_at <= datetime('now')`
  );
}

// ── Days since planting helper ────────────────────────────────────────────────
export function daysSincePlanting(plantingDate: string): number {
  const planted = new Date(plantingDate);
  const now = new Date();
  const diffMs = now.getTime() - planted.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
