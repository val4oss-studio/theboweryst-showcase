import {getDb, closeDb} from '@/data/db/client';

try {
  console.log("Starting database migration...");
  const db = getDb();
  console.log("Migration completed successfully.");
  closeDb();
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
}

