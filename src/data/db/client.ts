import Database from 'better-sqlite3';
import fs from 'fs';
import { getDbPath, DB_CONFIG } from './config';
import { runMigrations } from './migrations';

// Singleton pattern to ensure only one database connection exists
let db : Database.Database | null = null;
let isInit = false;

/**
 * Get the database connection. If it doesn't exist, create it and run
 * migrations.
 */
export function getDb(): Database.Database {
    if (!db) {
      const dbPath = getDbPath();
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(DB_CONFIG.dbDir, { recursive: true });
        console.log(`Created database directory at ${DB_CONFIG.dbDir}`);
      }

      db = new Database(dbPath);

      // Enable foreign key constraints Important
      db.pragma('foreign_keys = ON');
      // For best perf:
      db.pragma('journal_mode = WAL');

      // Auto-close in process exit
      process.on('exit', closeDb);
      process.on('SIGINT', () => process.exit(0));
      process.on('SIGTERM', () => process.exit(0));

      console.log(`Database connected at ${dbPath}`);
    }

    if (!isInit) {
        runMigrations(db);
        isInit = true;
    }

    return db;
}

/**
 * Close the database connection. This should be called when the application is
 * shutting down.
 */
export function closeDb(): void {
    if (db) {
        db.close();
        db = null;
        isInit = false;
        console.log('Database connection closed.');
    }
}
