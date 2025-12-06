import type { LocalizedText } from '@/config/locales';

/**
 * Artist entity representing an artist in the system.
 *
 * @property {number} id - Unique identifier for the artist.
 * @property {string} username - The artist's username.
 * @property {LocalizedText} bio - A brief biography of the artist.
 * @property {string} instagramName - The artist's Instagram handle.
 * @property {string} [profileImage] - Optional URL to the artist's profile
 * image.
 */
export interface ArtistEntity {
  id: number;
  username: string;
  bio: LocalizedText;
  instagramName: string;
  profilePicture?: string;
}

/**
 * Data required to create a new artist in the system.
 *
 * @property {string} username - The artist's username.
 * @property {LocalizedText} bio - A brief biography of the artist.
 * @property {string} instagramId - The artist's Instagram handle.
 * @property {string} [profilePicture] - Optional URL to the artist's profile
 * image.
 */
export interface CreateArtistData {
  username: string;
  bio: LocalizedText;
  instagramId: string;
  profilePicture?: string;
}

/**
 * Data for updating an existing artist. All fields are optional, allowing for
 * partial updates.
 *
 * @property {string} [username] - The artist's username.
 * @property {LocalizedText} [bio] - A brief biography of the artist.
 * @property {string} [instagramId] - The artist's Instagram handle.
 * @property {string} [profilePicture] - Optional URL to the artist's profile
 * image.
 */
  export interface UpdateArtistData {
    username?: string;
    bio?: Partial<LocalizedText>;
    instagramId?: string;
    profilePicture?: string;
  }


/**
 * Returns the profile image URL for the given artist. If the artist does not
 * have a profile picture, it returns a default avatar image URL.
 *
 * @param {ArtistEntity} artist - The artist for whom to get the profile image.
 * @returns {string} The URL of the artist's profile image or a default avatar.
 */
export function getArtistProfileImage(artist: ArtistEntity): string {
  return artist.profilePicture || '/default-avatar.jpg';
}

/**
 * Constructs the link of the artist's instagram account from this username.
 *
 * @param {ArtistEntity} artist - The artist for whom to get the full name.
 * @return {string} The link of the artist's instagram account.
 */
export function getArtistInstagramUrl(artist: ArtistEntity): string | undefined {
  return artist.instagramName
    ? `https://www.instagram.com/${artist.instagramName}/`
    : undefined;
}
