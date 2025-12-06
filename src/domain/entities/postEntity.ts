/**
 * Business representation of an Instagram post.
 * media_urls is a string array (parsed from JSON).
 */
export interface PostEntity {
  id: number;
  artistId: number;
  postUrl: string;
  coverImageUrl: string;
  mediaUrls: string[];
  description: string | null;
  likeCount: number;
  commentCount: number;
}

/**
 * Data required to create a new post in the system. artistId is included as it
 * is required to associate the post with an artist.
 */
export type CreatePostData = Omit<PostEntity, 'id'>;

/**
 * Data for updating an existing post. All fields are optional, allowing for
 * partial updates. artistId is not included as it should not be changed after
 * creation.
 */
export type UpdatePostData = Partial<Omit<CreatePostData, 'artistId'>>;

/** 
 * Returns the first media URL from the post's mediaUrls array
 */
export function getPostCoverImage(post: PostEntity): string | undefined {
  return post.mediaUrls.length > 0 ? post.mediaUrls[0] : undefined;
}

/**
 * Checks if the post is a carousel
 */
export function isCarousel(post: PostEntity): boolean {
  return post.mediaUrls.length > 1;
}
