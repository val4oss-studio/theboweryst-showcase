import type { Metadata } from "next";
import type { Locale } from "@/config/locales";
import { locales } from "@/config/locales";
import { I18nProvider } from "@/app/i18n/provider";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return {
    title: isFr
      ? "The Bowery Street | Studio de Tatouage Professionnel à Lorient"
      : "The Bowery Street | Professional Tattoo Studio in Lorient, France",
    description: isFr
      ? "Studio de tatouage professionnel à Lorient, Bretagne. Miss Bunny, Manolita et Lisa. Tatouages personnalisés depuis août 2024. 6 Rue Turenne, 56100 Lorient."
      : "Professional tattoo studio in Lorient, Brittany. Miss Bunny, Manolita and Lisa. Custom tattoos since August 2024. 6 Rue Turenne, 56100 Lorient.",
    keywords: isFr
      ? ["tatouage lorient", "tattoo lorient", "studio tatouage lorient", "the boweryst", "tatoueur bretagne", "tatouage morbihan"]
      : ["tattoo lorient", "tattoo studio lorient", "the boweryst", "lorient tattoo artist", "brittany tattoo", "france tattoo studio"],
    openGraph: {
      type: "website",
      locale: isFr ? "fr_FR" : "en_US",
      url: `https://theboweryst.fr/${locale}`,
      siteName: "The Bowery Street Tattoo Studio",
      title: isFr
        ? "The Bowery Street | Studio de Tatouage à Lorient"
        : "The Bowery Street | Tattoo Studio in Lorient",
      description: isFr
        ? "Studio de tatouage professionnel à Lorient. Miss Bunny, Manolita et Lisa. Tatouages personnalisés depuis août 2024."
        : "Professional tattoo studio in Lorient, France. Miss Bunny, Manolita and Lisa. Custom tattoos since August 2024.",
      images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "The Bowery Street Tattoo Studio Lorient" }],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr
        ? "The Bowery Street | Studio de Tatouage à Lorient"
        : "The Bowery Street | Tattoo Studio in Lorient",
      description: isFr
        ? "Studio de tatouage professionnel à Lorient avec 3 artistes passionnés."
        : "Professional tattoo studio in Lorient with 3 passionate artists.",
      images: ["/logo.jpg"],
    },
    alternates: {
      canonical: `https://theboweryst.fr/${locale}`,
      languages: {
        'fr': 'https://theboweryst.fr/fr',
        'en': 'https://theboweryst.fr/en',
        'x-default': 'https://theboweryst.fr/fr',
      },
    },
  };
}

// Generate static params for /fr and /en at build time
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <I18nProvider initialLocale={locale as Locale}>
      {children}
    </I18nProvider>
  );
}
