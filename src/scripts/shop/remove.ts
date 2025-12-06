import { deleteShop, getShop } from '@/domain/services/shopService';

try {
  const shop = getShop();
  if (!shop) {
    console.error('No shop found in database.');
    process.exit(1);
  }

  deleteShop();
  console.log(`Shop "${shop.name}" removed successfully.`);
} catch (error) {
  console.error('Error removing shop:', error);
  process.exit(1);
}
