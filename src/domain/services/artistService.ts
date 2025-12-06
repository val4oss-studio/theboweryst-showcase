import { ArtistRepository } from '@/data/repositories/artistRepository';
import type {
  ArtistEntity,
  CreateArtistData,
  UpdateArtistData,
} from '@/domain/entities/artistEntity';

/**
 * Fetches all artists from the database and returns them as an array of
 * ArtistEntity objects.
 *
 * @returns {ArtistEntity[]} array of ArtistEntity objects representing all
 * artists in the database.
 */
export function getAllArtists(): ArtistEntity[] {
  return new ArtistRepository().findAll();
}

/**
 * Fetches an artist by their unique identifier and returns it as an
 * ArtistEntity object.
 *
 * @param {number} id - The unique identifier of the artist to fetch.
 * @returns {ArtistEntity | null} an ArtistEntity object representing the
 * artist with the given ID, or null if no such artist exists.
 */
export function getArtistById(id: number): ArtistEntity | null {
  return new ArtistRepository().findById(id) ?? null;
}

/**
 * Fetches an artist by their username and returns it as an ArtistEntity object.
 *
 * @param {string} username - The username of the artist to fetch.
 * @returns {ArtistEntity | null} an ArtistEntity object representing the
 * artist with the given username, or null if no such artist exists.
 */
export function getArtistByUsername(username: string): ArtistEntity | null {
  return new ArtistRepository().findByUsername(username) ?? null;
}

/**
 * Create artist data in the database and return the created ArtistEntity.
 *
 * @param {CreateArtistData} data - The data required to create a new artist,
 * including username, bio, instagramId, and an optional profile picture URL.
 * @return {ArtistEntity} The newly created ArtistEntity object representing the
 * artist that was created in the database.
 **/
export function createArtist(data: CreateArtistData): ArtistEntity {
  return new ArtistRepository().create(data);
}


/**
 * Updates an existing artist in the database with the provided data and returns
 * the updated ArtistEntity.
 *
 * @param {number} id - The unique identifier of the artist to update.
 * @param {UpdateArtistData} data - An object containing the properties to update
 * for the artist, which may include username, bio, instagramId, and an optional
 * profile picture URL.
 * @return {ArtistEntity | null} The updated ArtistEntity object representing
 * the artist after the update, or null if no such artist exists.
 **/
export function updateArtist(id: number, data: UpdateArtistData): ArtistEntity | null {
  return new ArtistRepository().update(id, data) ?? null;
}

/**
 * Deletes an artist from the database by their unique identifier.
 *
 * @param {number} id - The unique identifier of the artist to delete.
 * @returns {boolean} true if the artist was successfully deleted, or false if
 * no such artist exists.
 */
export function deleteArtist(id: number): boolean {
  return new ArtistRepository().delete(id);
}
