import { z } from 'zod';
import type { CreateShopData, UpdateShopData } from '@/domain/entities/shopEntity';
import { locales } from '@/config/locales'
import { localizedTextSchema, partialLocalizedTextSchema } from './utils'

const translatableFields = [
  'description', 'scheduleWeekdays', 'scheduleWeekend'
] as const;
const invariantFields    = [
  'name', 'addressStreet', 'addressCity', 'addressZip', 'addressCountry',
  'mapUrl', 'instagramUrl', 'instagramUsername', 'facebookUrl',
  'facebookUsername',
] as const;

export const createShopSchema: z.ZodType<CreateShopData> = z.object({
  name:              z.string().min(1, 'Name is required').trim(),
  description:       localizedTextSchema,
  addressStreet:     z.string().min(1, 'Street address is required').trim(),
  addressCity:       z.string().min(1, 'City is required').trim(),
  addressZip:        z.string().min(1, 'ZIP code is required').trim(),
  addressCountry:    z.string().min(1, 'Country is required').trim(),
  mapUrl:            z.string().url('Map URL must be a valid URL').trim(),
  instagramUrl:      z.string().url('Instagram URL must be a valid URL').trim(),
  instagramUsername: z.string().min(1, 'Instagram username is required').trim(),
  facebookUrl:       z.string().url('Facebook URL must be a valid URL').trim(),
  facebookUsername:  z.string().min(1, 'Facebook username is required').trim(),
  scheduleWeekdays:  localizedTextSchema,
  scheduleWeekend:   localizedTextSchema,
});

export const updateShopSchema: z.ZodType<UpdateShopData> = z.object({
  name:              z.string().min(1).trim().optional(),
  description:       partialLocalizedTextSchema.optional(),
  addressStreet:     z.string().min(1).trim().optional(),
  addressCity:       z.string().min(1).trim().optional(),
  addressZip:        z.string().min(1).trim().optional(),
  addressCountry:    z.string().min(1).trim().optional(),
  mapUrl:            z.string().url().trim().optional(),
  instagramUrl:      z.string().url().trim().optional(),
  instagramUsername: z.string().min(1).trim().optional(),
  facebookUrl:       z.string().url().trim().optional(),
  facebookUsername:  z.string().min(1).trim().optional(),
  scheduleWeekdays:  partialLocalizedTextSchema.optional(),
  scheduleWeekend:   partialLocalizedTextSchema.optional(),
});

export const updateShopFieldSchema = z.object({
  field:  z.enum([...translatableFields, ...invariantFields]),
  locale: z.enum(locales as [typeof locales[number],
                 ...typeof locales[number][]]).optional(),
  value:  z.string().min(1, 'Value cannot be empty'),
}).refine(
  (data) => {
    if ((translatableFields as readonly string[]).includes(data.field)) {
      return data.locale !== undefined;
    }
    return true;
  },
  { message: 'Locale is required for translatable fields (description, scheduleWeekdays, scheduleWeekend)',
    path: ['locale']
  }
);
