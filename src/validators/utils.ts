import { z } from 'zod';
import { locales, type Locale } from '@/config/locales'

export const localizedTextSchema = z.object(
  Object.fromEntries(locales.map(locale => [
    locale,
    z.string().min(1, `${locale} translation cannot be empty`).trim(),
  ])) as Record<Locale, z.ZodString>
);

export const partialLocalizedTextSchema = z.object(
  Object.fromEntries(locales.map(locale => [
    locale,
    z.string().min(1, `${locale} translation cannot be empty`).trim().optional(),
  ])) as Record<Locale, z.ZodOptional<z.ZodString>>
);


/**
 * Format ZodError issues into a readable string format.
 *
 * @param {z.ZodError} error - The ZodError object containing validation issues.
 * @returns {string} A formatted string listing all validation errors.
 */
export function formatZodErrors(error: z.ZodError): string[] {
  return error.issues.map((issue: z.ZodIssue) =>
     `- ${issue.path.join('.')} : ${issue.message}`
  );
}
