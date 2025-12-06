import { getDb } from "@/data/db/client";
import type { Post } from "@/data/models/post";
import { toPostEntity, toPostEntities } from "@/data/mappers/postMapper";
import type {
  PostEntity, CreatePostData, UpdatePostData,
} from "@/domain/entities/postEntity";

/**
 * PostRepository is a class that provides methods to interact with the posts
 * table in the database. It has methods to find all posts, find a post by
 * id, create a new post, update an existing post, and delete a post.
 */
export class PostRepository {
  private db = getDb();

  /**
   * Retrieves all posts from the database.
   *
   * @returns {PostEntity[]} An array of Post objects representing all posts.
   */
  findAll(): PostEntity[] {
    const stmt = this.db.prepare('SELECT * FROM posts');
    return toPostEntities(stmt.all() as Post[]);
  }

  /**
   * Finds a post by its unique identifier.
   *
   * @param {number} id - The unique identifier of the post to find.
   * @returns {PostEntity | undefined} A Post object if found, or undefined if
   * no post with the given ID exists.
   */
  findById(id: number): PostEntity | undefined {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?');
    const row = stmt.get(id) as Post | undefined;
    return row ? toPostEntity(row) : undefined;
  }

  /**
   * Find a post by artists id.
   *
   * @param {number} artist_id - The unique identifier of the artist to find.
   * @returns {PostEntity | undefined} A Post object if found, or undefined if
   * no post with the given artist_id exists.
   */
  findByArtistId(artist_id: number): PostEntity[] {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE artist_id = ?');
    return toPostEntities(stmt.all(artist_id) as Post[]);
  }

  /**
   * Create a new post in the database.
   *
   * @param {CreatePostData} data - An object containing the properties of the
   * post to create
   * @returns {PostEntity} The newly created Post object.
   */
  create(data: CreatePostData): PostEntity {
    const stmt = this.db.prepare(`
      INSERT INTO posts (
        artist_id, post_url, cover_image_url, media_urls, description, like_count, comment_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *
    `);
    return toPostEntity(stmt.get(
      data.artistId,
      data.postUrl,
      data.coverImageUrl,
      JSON.stringify(data.mediaUrls),
      data.description ?? null,
      data.likeCount,
      data.commentCount
    ) as Post);
  }

  /**
   * Updates an existing post in the database.
   *
   * @param {number} id - The unique identifier of the post to update.
   * @param {UpdatePostData} data - An object containing the properties of the
   * post to update, 
   * @returns {PostEntity | undefined} The updated Post object if the update was
   * successful, or undefined if no post with the given ID exists.
   */
  update(id: number, data: UpdatePostData): PostEntity | undefined {
    const stmt = this.db.prepare(`
      UPDATE posts SET
        post_url = COALESCE(?, post_url),
        cover_image_url = COALESCE(?, cover_image_url),
        media_urls = COALESCE(?, media_urls),
        description = COALESCE(?, description),
        like_count = COALESCE(?, like_count),
        comment_count = COALESCE(?, comment_count)
      WHERE id = ? RETURNING *
    `);
    const row = stmt.get(
      data.postUrl ?? null,
      data.coverImageUrl ?? null,
      data.mediaUrls ? JSON.stringify(data.mediaUrls) : null,
      data.description ?? null,
      data.likeCount ?? null,
      data.commentCount ?? null,
      id
    ) as Post | undefined;
    return row ? toPostEntity(row) : undefined;
  }

  /**
   * Deletes a post from the database.
   *
   * @param {number} id - The unique identifier of the post to delete.
   * @returns {boolean} True if the post was successfully deleted, or false if
   * no post with the given ID exists.
   */
  delete(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM posts WHERE id = ?');
    return stmt.run(id).changes > 0;
  }

  /**
   * Deletes all posts associated with a specific artist from the database.
   *
   * @param {number} artistId - The unique identifier of the artist whose posts
   * should be deleted.
   * @returns {boolean} True if any posts were successfully deleted, or false if
   * no posts with the given artist_id exist.
   */
  deleteByArtistId(artistId: number): boolean {
    const stmt = this.db.prepare('DELETE FROM posts WHERE artist_id = ?');
    return stmt.run(artistId).changes > 0;
  }
}
