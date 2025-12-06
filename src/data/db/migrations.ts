import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { DB_CONFIG, getMigrationsPath } from './config';

/**
 * Create the migrations table if it doesn't exist.
 * This table will track which migrations have been applied.
 */
function createMigrationsTable(db: Database.Database): void {
    db.exec(`
      CREATE TABLE IF NOT EXISTS ${DB_CONFIG.migrationsTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
}

/**
 * Get a list of applied migrations from the database.
 */
function getAppliedMigrations(db: Database.Database): Set<string> {
    const stmt = db.prepare(`SELECT name FROM ${DB_CONFIG.migrationsTable}`);
    const rows = stmt.all() as { name: string }[];
    return new Set(rows.map(row => row.name));
}

/**
 * Return a sorted list of migration files from the migrations directory.
 */
function getAvailableMigrations(): string[] {
  const migrationsPath = getMigrationsPath();
  if (!fs.existsSync(migrationsPath)) {
    console.warn(`Migrations directory not found at ${migrationsPath}`);
    return [];
  }
  return fs.readdirSync(migrationsPath)
    .filter(file => file.endsWith('.sql'))
    .sort();
}

/**
 * Apply one migration to the database.
 */
function applyMigration(db: Database.Database, migrationFile: string): void {
    const migrationPath = path.join(getMigrationsPath(), migrationFile);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    db.transaction(() => {
      db.exec(migrationSQL);
      db.prepare(`INSERT INTO ${DB_CONFIG.migrationsTable} (name) VALUES (?)`)
        .run(migrationFile);
    })();
    console.log(`Applied migration: ${migrationFile}`);
}

/**
 * Main function to run migrations.
 */
export function runMigrations(db: Database.Database): void {
  console.log('Running remaining database migrations...');
  createMigrationsTable(db);
  const appliedMigrations = getAppliedMigrations(db);
  const availableMigrations = getAvailableMigrations();

  if (availableMigrations.length === 0) {
    console.log('No migration files found. Skipping migrations.');
    return;
  }

  const pendingMigrations = availableMigrations.filter(
    m => !appliedMigrations.has(m)
  );

  if (pendingMigrations.length === 0) {
    console.log('All migrations are already applied. No action needed.');
    return;
  }
  pendingMigrations.forEach(migration => {
    try {
      applyMigration(db, migration);
    } catch (error) {
      console.error(`Failed to apply migration ${migration}:`, error);
      throw error; // Stop further migrations if one fails
    }
  });
  console.log('All pending migrations have been applied successfully.');
}
