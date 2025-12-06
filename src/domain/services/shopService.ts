import { ShopRepository } from '@/data/repositories/shopRepository';
import type {
  ShopEntity,
  CreateShopData,
  UpdateShopData,
} from '@/domain/entities/shopEntity';

export function getShop(): ShopEntity | null {
  return new ShopRepository().findFirst() ?? null;
}

export function createShop(data: CreateShopData): ShopEntity {
  return new ShopRepository().create(data);
}

export function updateShop(data: UpdateShopData): ShopEntity | null {
  return new ShopRepository().update(data) ?? null;
}

export function deleteShop(): boolean {
  return new ShopRepository().delete();
}
