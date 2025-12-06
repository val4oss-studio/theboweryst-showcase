import path from 'path';

/**
 * Database configuration constants.
 */
export const DB_CONFIG = {
  dbDir: path.resolve(
    process.cwd(), 
    process.env.DATABASE_DIR || 'database'
  ),
  dbFile: process.env.DATABASE_FILE || 'app.db',
  migrationsDir: path.resolve(
    process.cwd(),
    'src', 'data', 'db', 'migrations'
  ),
  migrationsTable: '_migrations',
} as const;

/**
 * Returns the full path to the SQLite database file.
 */
export function getDbPath(): string {
  return path.join(DB_CONFIG.dbDir, DB_CONFIG.dbFile);
}

/**
 * Returns the path to the migrations directory.
 */
export function getMigrationsPath(): string {
  return DB_CONFIG.migrationsDir;
}
