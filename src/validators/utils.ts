import { z } from 'zod';
import { locales } from '@/config/locales'

export const localizedTextSchema = z.object(
  Object.fromEntries(locales.map(locale => [
    locale,
    z.string().min(1, `${locale} translation cannot be empty`).trim(),
  ]))
) as z.ZodType<Record<typeof locales[number], string>>;

export const partialLocalizedTextSchema = z.object(
  Object.fromEntries(locales.map(locale => [
    locale,
    z.string().min(1, `${locale} translation cannot be empty`).trim().optional(),
  ]))
) as z.ZodType<Partial<Record<typeof locales[number], string>>>;


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
