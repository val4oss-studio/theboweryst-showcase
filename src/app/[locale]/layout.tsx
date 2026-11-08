import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { locales } from "@/config/locales";
import { I18nProvider } from "@/app/i18n/provider";
import { buildHomeMetadata } from "@/app/lib/seo/metadata";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata(locale as Locale);
}

// Generate static params for /fr and /en at build time
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Any other segment (`/xyz`) is a 404, not a copy of the home page.
export const dynamicParams = false;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <I18nProvider initialLocale={locale as Locale}>
      {children}
    </I18nProvider>
  );
}
