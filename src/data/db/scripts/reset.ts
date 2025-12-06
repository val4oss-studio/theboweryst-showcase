import { getDb, closeDb } from "@/data/db/client";
import { DB_CONFIG } from "@/data/db/config";

console.log("Resetting database...");

/**
 * This script resets the database by deleting all records from the artists table
 * and resetting the auto-increment sequence. It can be extended to reset other
 * tables or migration history if needed. Use with caution, as this will
 * permanently delete data.
 */
try {
  const dbPath = DB_CONFIG.dbFile;
  const dbDir = DB_CONFIG.dbDir;
  const fullDbPath = `${dbDir}/${dbPath}`;

  const db = getDb();
  db.prepare('DELETE FROM artists').run();
  console.log("All records from the artists table have been deleted.");
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'artists'").run();
  console.log("Auto-increment sequence for artists table has been reset.");
  // To reset also mirgations:
  // db.prepare('DELETE FROM ${DB_CONFIG.migrationsTable}').run();
  db.prepare('DELETE FROM shop').run();
  console.log("Shop record has been deleted.");
  console.log("Database reset successfully.");
} catch (error) {
  console.error("Error resetting database:", error);
  process.exit(1);
} finally {
  closeDb();
}
