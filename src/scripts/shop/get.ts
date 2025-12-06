import { getShop } from '@/domain/services/shopService';

try {
  const shop = getShop();
  if (!shop) {
    console.log('No shop found in database.');
    process.exit(0);
  }
  console.log(`Name               : ${shop.name}`);
  console.log(`Description FR     : ${shop.description.fr}`);
  console.log(`Description EN     : ${shop.description.en}`);
  console.log(`Address            : ${shop.addressStreet}, ${shop.addressZip} ${shop.addressCity}, ${shop.addressCountry}`);
  console.log(`Map URL            : ${shop.mapUrl}`);
  console.log(`Instagram          : @${shop.instagramUsername} (${shop.instagramUrl})`);
  console.log(`Facebook           : ${shop.facebookUsername} (${shop.facebookUrl})`);
  console.log(`Schedule FR (week) : ${shop.scheduleWeekdays.fr}`);
  console.log(`Schedule EN (week) : ${shop.scheduleWeekdays.en}`);
  console.log(`Schedule FR (w-end): ${shop.scheduleWeekend.fr}`);
  console.log(`Schedule EN (w-end): ${shop.scheduleWeekend.en}`);
} catch (error) {
  console.error('Error getting shop:', error);
  process.exit(1);
}
