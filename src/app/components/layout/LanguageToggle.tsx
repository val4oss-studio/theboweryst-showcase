"use client";

import { useI18n } from "@/app/i18n/provider";
import { locales } from "@/config/locales";
import { localeFlags } from "@/app/i18n/config";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggleLocale = () => {
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    setLocale(locales[nextIndex]);
  };

  return (
    <button
      onClick={toggleLocale}
      className="btn-icon"
      aria-label={`Switch language (current: ${locale})`}
      title={`Switch to ${locale === "en" ? "Français" : "English"}`}
    >
      <span style={{ fontSize: '1.25rem' }}>
        {localeFlags[locale]}
      </span>
    </button>
  );
}
