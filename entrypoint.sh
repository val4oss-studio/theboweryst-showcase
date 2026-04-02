#!/bin/sh
set -e

DB_FILE="${DATABSE_DIR}/theboweryst.db"
if [ ! -f "$DB_FILE" ]; then
    echo "Database file not found. Initializing database..."
    node scripts/db/migrate.js
    node scripts/db/seed.js
    echo "Database initialialized"
fi

exec node server.js
