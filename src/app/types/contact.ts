export interface ContactInfo {
  location: {
    street: string;
    city: string;
    country: string;
    zip: string;
    name?: string;
  };
  hours: {
    weekdays: string;
    weekend: string;
  };
  contact: {
    email: string;
    phone: string;
    instagram: string;
    facebook: string;
  };
}
