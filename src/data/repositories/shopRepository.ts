import { getDb } from '@/data/db/client';
import type { Shop, ShopRow } from '@/data/models/shop';
import { toShopEntity } from '@/data/mappers/shopMapper';
import type {
  ShopEntity,
  CreateShopData,
  UpdateShopData,
} from '@/domain/entities/shopEntity';
import { locales } from '@/config/locales';

const SELECT_WITH_TRANSLATIONS = `
  SELECT
    s.*,
    json_group_object(st.locale, st.description)       AS description_json,
    json_group_object(st.locale, st.schedule_weekdays) AS schedule_weekdays_json,
    json_group_object(st.locale, st.schedule_weekend)  AS schedule_weekend_json
  FROM shop s
  LEFT JOIN shop_translations st ON s.id = st.shop_id
`;

export class ShopRepository {
  private db = getDb();

  findFirst(): ShopEntity | undefined {
    const stmt = this.db.prepare(`
      ${SELECT_WITH_TRANSLATIONS}
      WHERE s.id = 1
      GROUP BY s.id
    `);
    const row = stmt.get() as ShopRow | undefined;
    return row ? toShopEntity(row) : undefined;
  }

  create(data: CreateShopData): ShopEntity {
    const insertTranslation = this.db.prepare(`
      INSERT INTO shop_translations
        (shop_id, locale, description, schedule_weekdays, schedule_weekend)
      VALUES (1, ?, ?, ?, ?)
    `);

    const transaction = this.db.transaction(() => {
      this.db.prepare(`
        INSERT OR REPLACE INTO shop (
          id, name,
          address_street, address_city, address_zip, address_country,
          map_url,
          instagram_url, instagram_username,
          facebook_url, facebook_username
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        data.name,
        data.addressStreet,
        data.addressCity,
        data.addressZip,
        data.addressCountry,
        data.mapUrl,
        data.instagramUrl,
        data.instagramUsername,
        data.facebookUrl,
        data.facebookUsername,
      );

      for (const locale of locales) {
        insertTranslation.run(
          locale,
          data.description[locale],
          data.scheduleWeekdays[locale],
          data.scheduleWeekend[locale],
        );
      }
    });

    transaction();
    return this.findFirst()!;
  }

  update(data: UpdateShopData): ShopEntity | undefined {
    const upsertTranslation = this.db.prepare(`
      INSERT INTO shop_translations
        (shop_id, locale, description, schedule_weekdays, schedule_weekend)
      VALUES (1, ?, ?, ?, ?)
      ON CONFLICT(shop_id, locale) DO UPDATE SET
        description       = COALESCE(excluded.description,       description),
        schedule_weekdays = COALESCE(excluded.schedule_weekdays, schedule_weekdays),
        schedule_weekend  = COALESCE(excluded.schedule_weekend,  schedule_weekend)
    `);

    const transaction = this.db.transaction(() => {
      // Mise à jour des champs invariants
      const hasInvariantUpdate = data.name || data.addressStreet
        || data.addressCity || data.addressZip || data.addressCountry
        || data.mapUrl || data.instagramUrl || data.instagramUsername
        || data.facebookUrl || data.facebookUsername;

      if (hasInvariantUpdate) {
        this.db.prepare(`
          UPDATE shop SET
            name               = COALESCE(?, name),
            address_street     = COALESCE(?, address_street),
            address_city       = COALESCE(?, address_city),
            address_zip        = COALESCE(?, address_zip),
            address_country    = COALESCE(?, address_country),
            map_url            = COALESCE(?, map_url),
            instagram_url      = COALESCE(?, instagram_url),
            instagram_username = COALESCE(?, instagram_username),
            facebook_url       = COALESCE(?, facebook_url),
            facebook_username  = COALESCE(?, facebook_username)
          WHERE id = 1
        `).run(
          data.name              ?? null,
          data.addressStreet     ?? null,
          data.addressCity       ?? null,
          data.addressZip        ?? null,
          data.addressCountry    ?? null,
          data.mapUrl            ?? null,
          data.instagramUrl      ?? null,
          data.instagramUsername ?? null,
          data.facebookUrl       ?? null,
          data.facebookUsername  ?? null,
        );
      }

      // Mise à jour des traductions (par locale, champ par champ)
      const hasTranslationUpdate = data.description
        || data.scheduleWeekdays
        || data.scheduleWeekend;
      if (hasTranslationUpdate) {
        for (const locale of locales) {
          const desc  = data.description?.[locale]       ?? null;
          const wkd   = data.scheduleWeekdays?.[locale]  ?? null;
          const wke   = data.scheduleWeekend?.[locale]   ?? null;

          if (desc !== null || wkd !== null || wke !== null) {
            upsertTranslation.run(locale, desc, wkd, wke);
          }
        }
      }
    });

    transaction();
    return this.findFirst();
  }

  delete(): boolean {
    return this.db.prepare('DELETE FROM shop WHERE id = 1').run().changes > 0;
  }
}
