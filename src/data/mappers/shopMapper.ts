import type { ShopRow } from '@/data/models/shop';
import type { ShopEntity } from '@/domain/entities/shopEntity';
import { parseLocalizedText } from '@/data/mappers/utils';

export function toShopEntity(row: ShopRow): ShopEntity {
  return {
    id:                 row.id,
    name:               row.name,
    description:        parseLocalizedText(row.description_json),
    addressStreet:      row.address_street,
    addressCity:        row.address_city,
    addressZip:         row.address_zip,
    addressCountry:     row.address_country,
    mapUrl:             row.map_url,
    instagramUrl:       row.instagram_url,
    instagramUsername:  row.instagram_username,
    facebookUrl:        row.facebook_url,
    facebookUsername:   row.facebook_username,
    scheduleWeekdays:   parseLocalizedText(row.schedule_weekdays_json),
    scheduleWeekend:    parseLocalizedText(row.schedule_weekend_json),
  };
}
