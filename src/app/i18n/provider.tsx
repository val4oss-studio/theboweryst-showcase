"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  type Locale,
  defaultLocale
} from '@/config/locales'
import { getTranslations, type Translations } from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const router = useRouter();
  const [locale] = useState<Locale>(initialLocale);
  const [translations] = useState<Translations>(
    getTranslations(initialLocale)
  );

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== initialLocale) {
      router.push(newLocale === defaultLocale ? '/' : `/${newLocale}`)
    }
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
