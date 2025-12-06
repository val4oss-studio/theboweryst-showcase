import { getDb } from "@/data/db/client";
import type { Artist, ArtistRow } from "@/data/models/artist";
import  {
  toArtistEntity,
  toArtistEntities,
} from "@/data/mappers/artistMapper";
import type {
  ArtistEntity,
  CreateArtistData,
  UpdateArtistData,
} from "@/domain/entities/artistEntity";

import { locales } from '@/config/locales';

const SELECT_WITH_TRANSLATIONS = `
  SELECT
    a.*,
    json_group_object(at.locale, at.bio) AS bio_json
  FROM artists a
  LEFT JOIN artist_translations at ON a.id = at.artist_id
`;

export class ArtistRepository {
  private db = getDb();

  findAll(): ArtistEntity[] {
    const stmt = this.db.prepare(`
      ${SELECT_WITH_TRANSLATIONS}
      GROUP BY a.id
      ORDER BY a.id
    `);
    return toArtistEntities(stmt.all() as ArtistRow[]);
  }

  findById(id: number): ArtistEntity | undefined {
    const stmt = this.db.prepare(`
      ${SELECT_WITH_TRANSLATIONS}
      WHERE a.id = ?
      GROUP BY a.id
    `);
    const row = stmt.get(id) as ArtistRow | undefined;
    return row ? toArtistEntity(row) : undefined;
  }

  findByUsername(username: string): ArtistEntity | undefined {
    const stmt = this.db.prepare(`
      ${SELECT_WITH_TRANSLATIONS}
      WHERE a.username = ?
      GROUP BY a.id
    `);
    const row = stmt.get(username) as ArtistRow | undefined;
    return row ? toArtistEntity(row) : undefined;
  }

  create(data: CreateArtistData): ArtistEntity {
    const insertTranslation = this.db.prepare(`
      INSERT INTO artist_translations (artist_id, locale, bio)
      VALUES (?, ?, ?)
    `);

    const transaction = this.db.transaction(() => {
      const artist = this.db.prepare(`
        INSERT INTO artists (username, ig_id, profile_pic_url)
        VALUES (?, ?, ?) RETURNING *
      `).get(
        data.username,
        data.instagramId,
        data.profilePicture ?? null,
      ) as Artist;

      for (const locale of locales) {
        insertTranslation.run(artist.id, locale, data.bio[locale]);
      }

      return artist.id;
    });

    const artistId = transaction();
    return this.findById(artistId)!;
  }

  update(id: number, data: UpdateArtistData): ArtistEntity | undefined {
    const upsertTranslation = this.db.prepare(`
      INSERT INTO artist_translations (artist_id, locale, bio)
      VALUES (?, ?, ?)
      ON CONFLICT(artist_id, locale) DO UPDATE SET bio = excluded.bio
    `);

    const transaction = this.db.transaction(() => {
      if (data.username 
        || data.instagramId || data.profilePicture !== undefined) {
        this.db.prepare(`
          UPDATE artists SET
            username        = COALESCE(?, username),
            ig_id           = COALESCE(?, ig_id),
            profile_pic_url = COALESCE(?, profile_pic_url)
          WHERE id = ?
        `).run(
          data.username       ?? null,
          data.instagramId    ?? null,
          data.profilePicture ?? null,
          id,
        );
      }

      if (data.bio) {
        for (const [locale, value] of Object.entries(data.bio)) {
          if (value !== undefined) {
            upsertTranslation.run(id, locale, value);
          }
        }
      }
    });

    transaction();
    return this.findById(id);
  }

  delete(id: number): boolean {
    // ON DELETE CASCADE automatically delete artist_translations
    const stmt = this.db.prepare('DELETE FROM artists WHERE id = ?');
    return stmt.run(id).changes > 0;
  }
}
