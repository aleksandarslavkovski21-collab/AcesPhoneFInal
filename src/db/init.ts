import Database from 'better-sqlite3';
import path from 'path';

// Using .cjs or .ts ensures it runs inside our ES module setup smoothly
export function initDB(dbPath: string) {
  const db = new Database(dbPath, { verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined });

  // Recommended pragmas for performance and stability
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create Phones Table
  // We'll store the core searchable fields as columns and standard the rest in a JSON column for flexibility
  db.exec(`
    CREATE TABLE IF NOT EXISTS phones (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      price TEXT NOT NULL,
      ram TEXT NOT NULL,
      storage TEXT NOT NULL,
      condition TEXT NOT NULL,
      size_kb INTEGER DEFAULT 0,
      data JSON NOT NULL,      -- Stores the full objects to avoid writing 20+ columns for every dynamic field
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Config Table
  // Single row table to hold the AppConfig. We enforce ID=1.
  // Migration: Add size_kb if it doesn't exist
  const tableInfo = db.prepare("PRAGMA table_info(phones)").all() as any[];
  const hasSizeKb = tableInfo.some(col => col.name === 'size_kb');
  if (!hasSizeKb) {
    db.exec("ALTER TABLE phones ADD COLUMN size_kb INTEGER DEFAULT 0");
    console.log("[Database] Added size_kb column to phones table.");
  }

  return db;
}
