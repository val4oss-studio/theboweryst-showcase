--
-- Artists table - invariant data
--
CREATE TABLE IF NOT EXISTS artists (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT UNIQUE NOT NULL,
    ig_id TEXT      UNIQUE NULL,
    profile_pic_url TEXT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_artists_username ON artists(username);

-- trigger to add created_at and updated_at timestamps
CREATE TRIGGER IF NOT EXISTS set_users_timestamps
AFTER INSERT ON artists
BEGIN
    UPDATE artists SET 
        created_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

-- trigger to update updated_at on row modification
CREATE TRIGGER IF NOT EXISTS update_artists_timestamp
AFTER UPDATE ON artists
BEGIN
    UPDATE artists SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

--
-- artist translations
--
CREATE TABLE IF NOT EXISTS artist_translations (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_id   INTEGER NOT NULL,
    locale      TEXT    NOT NULL,
    bio         TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    UNIQUE(artist_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_artist_translations_artist_id
    ON artist_translations(artist_id);

--
-- Posts table
--
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist_id INTEGER NOT NULL,
    post_url TEXT NOT NULL,
    cover_image_url TEXT  NOT NULL,
    media_urls TEXT NOT NULL DEFAULT '[]',
    description TEXT,
    like_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Index on artist_id for faster lookups by artists
CREATE INDEX IF NOT EXISTS idx_posts_artists_id ON posts(artist_id);

-- Trigger to set timestamps on insert
CREATE TRIGGER IF NOT EXISTS set_posts_timestamps
AFTER INSERT ON posts
BEGIN
    UPDATE posts SET
        created_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.id;
END;

-- Trigger to update updated_at on row modification
CREATE TRIGGER IF NOT EXISTS update_posts_timestamp
AFTER UPDATE ON posts
BEGIN
    UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

--
-- Shop table (invariant data)
--
CREATE TABLE IF NOT EXISTS shop (
    id                  INTEGER PRIMARY KEY CHECK (id = 1),
    name                TEXT NOT NULL,
    address_street      TEXT NOT NULL,
    address_city        TEXT NOT NULL,
    address_zip         TEXT NOT NULL,
    address_country     TEXT NOT NULL,
    map_url             TEXT NOT NULL,
    instagram_url       TEXT NOT NULL,
    instagram_username  TEXT NOT NULL,
    facebook_url        TEXT NOT NULL,
    facebook_username   TEXT NOT NULL,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at on row modification
CREATE TRIGGER IF NOT EXISTS update_shop_timestamp
AFTER UPDATE ON shop
BEGIN
    UPDATE shop SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

--
-- shop translations
--
CREATE TABLE IF NOT EXISTS shop_translations (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id           INTEGER NOT NULL,
    locale            TEXT    NOT NULL,
    description       TEXT    NOT NULL DEFAULT '',
    schedule_weekdays TEXT    NOT NULL DEFAULT '',
    schedule_weekend  TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE,
    UNIQUE(shop_id, locale)
);

CREATE INDEX IF NOT EXISTS idx_shop_translations_shop_id
    ON shop_translations(shop_id);

