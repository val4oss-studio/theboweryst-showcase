import type { ArtistRow } from '@/data/models/artist';
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import { parseLocalizedText } from '@/data/mappers/utils';

/**
 * Converts an Artist model from the database into an ArtistEntity used in the
 * application domain. This function maps the properties from the database model
 * to the corresponding properties in the ArtistEntity, allowing for a clear
 * separation between the data layer and the domain layer of the application.
 *
 * @param {ArtistRow} row - The Artist model object retrieved from the database
 * with translations.
 * @returns {ArtistEntity} An ArtistEntity object with properties mapped from the
 * Artist model.
 */
export function toArtistEntity(row: ArtistRow): ArtistEntity {
  return {
    id: row.id,
    username: row.username,
    bio:  parseLocalizedText(row.bio_json),
    instagramName: row.ig_id,
    profilePicture: row.profile_pic_url ?? undefined,
  };
}

/**
 * Converts an array of Artist models from the database into an array of
 * ArtistEntity objects used in the application domain. This function iterates
 * over the array of Artist models and applies the toArtistEntity function to
 * each model, resulting in an array of ArtistEntity objects that can be used
 * throughout the application.
 *
 * @param {ArtistRow[]} rows - An array of Artist row objects retrieved from
 * the database.
 * @returns {ArtistEntity[]} An array of ArtistEntity objects with properties
 * mapped from the Artist models.
 */
export function toArtistEntities(rows: ArtistRow[]): ArtistEntity[] {
  return rows.map(toArtistEntity);
}
