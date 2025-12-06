export interface Shop {
  id: number;
  name: string;
  address_street: string;
  address_city: string;
  address_zip: string;
  address_country: string;
  map_url: string;
  instagram_url: string;
  instagram_username: string;
  facebook_url: string;
  facebook_username: string;
  created_at: string;
  updated_at: string;
}

export interface ShopRow extends Shop {
  description_json: string | null;
  schedule_weekdays_json: string | null;
  schedule_weekend_json: string | null;
}

export interface ShopTranslation {
  id: number;
  shop_id: number;
  locale: string;
  description: string;
  schedule_weekdays: string;
  schedule_weekend: string;
}
