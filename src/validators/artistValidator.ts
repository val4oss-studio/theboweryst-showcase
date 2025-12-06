import { z } from 'zod';
import type {
  CreateArtistData, UpdateArtistData
} from '@/domain/entities/artistEntity';
import { localizedTextSchema, partialLocalizedTextSchema } from './utils'

/**
 * The createArtistSchema is a Zod schema that defines the structure and
 * validation rules for the data required to create a new artist. It based
 * on the CreateArtistData type.
 **/
export const createArtistSchema: z.ZodType<CreateArtistData> = z.object({
  username: z
    .string({ error: 'Username is required' })
    .min(2, 'Username needs to be at least 2 chars')
    .max(100, 'Username cannot exceed 100 chars')
    .trim(),
  instagramId: z
    .string({ error: 'Instagram ID is required' })
    .min(2, 'Instagram ID needs to be at least 2 chars')
    .max(100, 'Instagram ID cannot exceed 100 chars')
    .trim(),
  bio: localizedTextSchema,
  profilePicture: z
    .string()
    .url('Profile picture URL must be a valid URL')
    .optional(),
});

export const updateArtistSchema: z.ZodType<UpdateArtistData> = z.object({
  username: z.string().min(2).max(100).trim().optional(),
  instagramId: z.string().min(2).max(100).trim().optional(),
  bio: partialLocalizedTextSchema.optional(),
  profilePicture: z.string().url().optional(),
});

export const artistIdSchema = z.object({
  id: z.coerce.number().positive('The ID needs to be a positive number'),
});
