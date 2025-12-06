import { z } from 'zod';
import type {
  CreatePostData, UpdatePostData
} from '@/domain/entities/postEntity';

export const createPostSchema = z.object({
  artistId: z.coerce.number().positive('Artist ID must be a positive number'),
  postUrl: z
    .string({ error: 'Post URL is required' })
    .url('Post URL must be a valid URL')
    .trim(),
  coverImageUrl: z
    .string({ error: 'Cover Image URL is required' })
    .url('Cover Image URL must be a valid URL')
    .trim(),
  mediaUrls: z
    .array(z.string().url('Each media URL must be a valid URL'))
    .min(1, 'At least one media URL is required'),
  description: z.string().nullable(),
  likeCount: z.coerce.number().int().min(0, 'Like count cannot be negative'),
  commentCount: z
    .coerce.number().int().min(0, 'Comment count cannot be negative'),
});

export const updatePostSchema:
  z.ZodType<UpdatePostData> = createPostSchema.omit({artistId: true}).partial();

export const postIdSchema = z.object({
  id: z.coerce.number().positive('Post ID must be a positive number'),
});
