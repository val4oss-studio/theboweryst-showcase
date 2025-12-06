/**
 * Post interface representing a post made by an artist.
 * It has properties for id, artist_id, post_url, media_urls, description,
 * like_count, comment_count, created_at, and updated_at.
 */
export interface Post {
  id: number;
  artist_id: number;
  post_url: string;
  cover_image_url: string;
  media_urls: string;
  description: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}
