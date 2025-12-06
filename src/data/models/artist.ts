/**
 * Artist is an interface that defines the structure of an artist object. It has
 * properties for id, username, ig_id, description, created_at, and updated_at.
 */
export interface Artist {
  id: number;
  username: string;
  ig_id: string;
  profile_pic_url: string | null;
  created_at: string;
  updated_at: string;
}

// SELECT request results with transaltions
export interface ArtistRow extends Artist {
  bio_json: string | null; // Column calculated by json_group_object
}

export interface ArtistTranslation {
  id: number;
  artist_id: number;
  locale: string;
  bio: string;
}
