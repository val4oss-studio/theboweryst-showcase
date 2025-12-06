import { createShop } from '@/domain/services/shopService';
import { createShopSchema } from '@/validators/shopValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 16) {
  console.error(
    'Usage: pnpm shop:set <name> <description_fr> <description_en>' +
    ' <street> <city> <zip> <country> <mapUrl>' +
    ' <instagramUrl> <instagramUsername>' +
    ' <facebookUrl> <facebookUsername>' +
    ' <scheduleWeekdays_fr> <scheduleWeekdays_en>' +
    ' <scheduleWeekend_fr> <scheduleWeekend_en>'
  );
  console.error('Tip: wrap values with spaces in quotes');
  process.exit(1);
}

const [
  name,
  description_fr, description_en,
  addressStreet, addressCity, addressZip, addressCountry,
  mapUrl,
  instagramUrl, instagramUsername,
  facebookUrl, facebookUsername,
  scheduleWeekdays_fr, scheduleWeekdays_en,
  scheduleWeekend_fr, scheduleWeekend_en,
] = args;

const parsed = createShopSchema.safeParse({
  name,
  description:      { fr: description_fr,      en: description_en },
  addressStreet, addressCity, addressZip, addressCountry,
  mapUrl,
  instagramUrl, instagramUsername,
  facebookUrl, facebookUsername,
  scheduleWeekdays: { fr: scheduleWeekdays_fr, en: scheduleWeekdays_en },
  scheduleWeekend:  { fr: scheduleWeekend_fr,  en: scheduleWeekend_en },
});

if (!parsed.success) {
  console.error('Validation errors:');
  formatZodErrors(parsed.error).forEach(msg => console.error(msg));
  process.exit(1);
}

try {
  const shop = createShop(parsed.data);
  console.log(`Shop set successfully: ${shop.name}`);
} catch (error) {
  console.error('Error setting shop:', error);
  process.exit(1);
}
