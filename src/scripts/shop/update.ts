import { updateShop } from '@/domain/services/shopService';
import { updateShopFieldSchema } from '@/validators/shopValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage:');
  console.error('  Translate field  : pnpm shop:update <field> <locale> <value>');
  console.error('  Invariant field  : pnpm shop:update <field> <value>');
  console.error('');
  console.error('Translate fields   : description, scheduleWeekdays, scheduleWeekend');
  console.error('Invariant fields   : name, addressStreet, addressCity, addressZip,');
  console.error('                     addressCountry, mapUrl, instagramUrl, instagramUsername,');
  console.error('                     facebookUrl, facebookUsername');
  process.exit(1);
}

// 3 args → champ traduit (field locale value)
// 2 args → champ invariant (field value)
const [field, second, third] = args;
const locale = third !== undefined ? second : undefined;
const value  = third !== undefined ? third  : second;

const parsed = updateShopFieldSchema.safeParse({ field, locale, value });
if (!parsed.success) {
  console.error('Validation errors:');
  formatZodErrors(parsed.error).forEach(msg => console.error(msg));
  process.exit(1);
}

// Construction du UpdateShopData selon le type de champ
const updateData = parsed.data.locale
  ? { [parsed.data.field]: { [parsed.data.locale]: parsed.data.value } }
  : { [parsed.data.field]: parsed.data.value };

try {
  const shop = updateShop(updateData);
  if (!shop) {
    console.error('No shop found in database. Run pnpm shop:set first.');
    process.exit(1);
  }
  const target = parsed.data.locale
    ? `"${parsed.data.field}" [${parsed.data.locale}]`
    : `"${parsed.data.field}"`;
  console.log(`Updated ${target} → "${parsed.data.value}"`);
} catch (error) {
  console.error('Error updating shop:', error);
  process.exit(1);
}
