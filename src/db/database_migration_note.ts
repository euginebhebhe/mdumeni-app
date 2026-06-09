// ── ADD THIS TO: src/db/database.ts ──────────────────────────────────────────
// Find your existing migrateDatabase function and add this migration
// It creates the price_cache table in the existing mdumeni.db

// STEP 1: Add this constant at the top of database.ts
export const PRICE_CACHE_MIGRATION = `
  CREATE TABLE IF NOT EXISTS price_cache (
    cache_key   TEXT PRIMARY KEY,
    data_json   TEXT NOT NULL,
    fetched_at  TEXT NOT NULL,
    price_date  TEXT NOT NULL
  );
`;

// STEP 2: Inside your migrateDatabase function, add this line
// alongside your other CREATE TABLE statements:
//
//   await db.execAsync(PRICE_CACHE_MIGRATION);
//
// Example — your migrateDatabase probably looks like this:
//
// export async function migrateDatabase(db: SQLiteDatabase) {
//   await db.execAsync(`CREATE TABLE IF NOT EXISTS farmers (...)`);
//   await db.execAsync(`CREATE TABLE IF NOT EXISTS sensor_readings (...)`);
//   await db.execAsync(PRICE_CACHE_MIGRATION);   // <-- ADD THIS LINE
// }
