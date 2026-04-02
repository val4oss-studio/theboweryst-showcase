import { PostRepository } from '@/data/repositories/postRepository';
import type {
  PostEntity, CreatePostData, UpdatePostData,
} from '@/domain/entities/postEntity';

/**
 * Fetches all posts from the database and returns them as an array of
 * PostEntity objects.
 *
 * @returns {PostEntity[]} array of PostEntity objects representing all
 * posts in the database.
 */
export function getAllPosts(): PostEntity[] {
  return new PostRepository().findAll();
}

/**
 * Fetches a post by its unique identifier and returns it as a PostEntity
 * object.
 *
 * @param {number} id - The unique identifier of the post to fetch.
 * @returns {PostEntity | null} a PostEntity object representing the post with
 * the given ID, or null if no such post exists.
 */
export function getPostById(id: number): PostEntity | null {
  return new PostRepository().findById(id) ?? null;
}

/**
 * Fetches all posts by an artist's unique identifier and returns them as an
 * array of PostEntity objects.
 *
 * @param {number} artistId - The unique identifier of the artist whose posts
 * to fetch.
 * @returns {PostEntity[]} array of PostEntity objects representing all posts
 * by the specified artist.
 */
export function getPostsByArtistId(artistId: number): PostEntity[] {
  return new PostRepository().findByArtistId(artistId);
}

/**
 * Fetches all post URLs by an artist's unique identifier and returns them as an
 * array of strings.
 *
 * @param {number} artistId - The unique identifier of the artist whose post
 * URLs to fetch.
 * @returns {string[]} array of strings representing the URLs of all posts by
 * the specified artist.
 */
export function getPostUrlsByArtistId(artistId: number): string[] {
  return new PostRepository().findPostUrlsByArtistId(artistId);
}

/**
 * Creates a new post in the database with the provided data and returns the
 * created PostEntity.
 *
 * @param {CreatePostData} data - The data required to create a new post.
 * @return {PostEntity} The newly created PostEntity object representing the
 * post that was created in the database.
 **/
export function createPost(data: CreatePostData): PostEntity {
  return new PostRepository().create(data);
}

/**
 * Updates an existing post in the database with the provided data and returns
 * the updated PostEntity.
 *
 * @param {number} id - The unique identifier of the post to update.
 * @param {UpdatePostData} data - An object containing the properties to update
 * for the post.
 * @return {PostEntity | null} The updated PostEntity object representing the
 * post that was updated in the database, or null if no such post exists.
 **/
export function updatePost(id: number, data: UpdatePostData): PostEntity | null {
  return new PostRepository().update(id, data) ?? null;
}

/**
 * Deletes a post from the database by its unique identifier.
 *
 * @param {number} id - The unique identifier of the post to delete.
 * @returns {boolean} true if the post was successfully deleted, or false if
 * no such post exists.
 */
export function deletePost(id: number): boolean {
  return new PostRepository().delete(id);
}

/**
 * Deletes all posts from the database that are associated with a specific
 * artist's unique identifier.
 *
 * @param {number} artistId - The unique identifier of the artist whose posts
 * to delete.
 * @returns {boolean} true if the posts were successfully deleted, or false if
 * no such posts exist.
 */
export function deletePostsByArtistId(artistId: number): boolean {
  return new PostRepository().deleteByArtistId(artistId);
}

/**
 * Deletes the oldest posts from the database that are associated with a specific
 * artist's unique identifier, keeping only a specified number of the most
 * recent posts.
 *
 * @param {number} artistId - The unique identifier of the artist whose oldest
 * posts to delete.
 * @param {number} limit - The number of most recent posts to keep for the
 * artist. All older posts beyond this limit will be deleted.
 * @returns {number} The number of posts that were deleted from the database.
 */
export function deleteOldestPostsBeyondLimit(artistId: number, limit: number):
  number {
    return new PostRepository().deleteOldestBeyondLimit(artistId, limit);
}
