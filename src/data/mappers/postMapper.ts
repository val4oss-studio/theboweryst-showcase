import type { Post } from '@/data/models/post';
import type { PostEntity } from '@/domain/entities/postEntity';


/**
 * Converts a Post model from the database into a PostEntity used in the
 * application domain. 
 *
 * @param {Post} model - The Post model object retrieved from the database.
 * @returns {PostEntity} A PostEntity object with properties mapped from the
 * Post model.
 */
export function toPostEntity(model: Post): PostEntity {
  return {
    id: model.id,
    artistId: model.artist_id,
    postUrl: model.post_url,
    coverImageUrl: model.cover_image_url,
    mediaUrls: JSON.parse(model.media_urls) as string[],
    description: model.description,
    likeCount: model.like_count,
    commentCount: model.comment_count,
  };
}

/**
 * Converts an array of Post models from the database into an array of
 * PostEntity objects used in the application domain.
 *
 * @param {Post[]} models - An array of Post model objects retrieved from the
 * database.
 * @returns {PostEntity[]} An array of PostEntity objects with properties mapped
 * from the Post models.
 */
export function toPostEntities(models: Post[]): PostEntity[] {
  return models.map(toPostEntity);
}
