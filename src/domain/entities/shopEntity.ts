import type { LocalizedText } from '@/config/locales';

export interface ShopEntity {
  id: number;
  name: string;
  description: LocalizedText;
  addressStreet: string;
  addressCity: string;
  addressZip: string;
  addressCountry: string;
  mapUrl: string;
  instagramUrl: string;
  instagramUsername: string;
  facebookUrl: string;
  facebookUsername: string;
  scheduleWeekdays: LocalizedText;
  scheduleWeekend: LocalizedText;
}

export type CreateShopData = Omit<ShopEntity, 'id'>;

export interface UpdateShopData {
  name?: string;
  description?: Partial<LocalizedText>;
  addressStreet?: string;
  addressCity?: string;
  addressZip?: string;
  addressCountry?: string;
  mapUrl?: string;
  instagramUrl?: string;
  instagramUsername?: string;
  facebookUrl?: string;
  facebookUsername?: string;
  scheduleWeekdays?: Partial<LocalizedText>;
  scheduleWeekend?: Partial<LocalizedText>;
}

export function getShopAddress(shop: ShopEntity): string {
  return `${shop.addressStreet}, ${shop.addressZip} ${shop.addressCity}`;
}
