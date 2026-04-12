import type { Metadata } from "next";
import { I18nProvider } from "@/app/i18n/provider";

export const metadata: Metadata = {
  title: "The Bowery Street | Studio de Tatouage Professionnel à Lorient",
  description: "Studio de tatouage professionnel à Lorient, Bretagne. Miss Bunny, Manolita et Lisa. Tatouages personnalisés depuis août 2024. 6 Rue Turenne, 56100 Lorient.",
  keywords: ["tatouage lorient", "tattoo lorient", "studio tatouage lorient", "the boweryst", "tatoueur bretagne", "tatouage morbihan"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://theboweryst.fr/",
    siteName: "The Bowery Street Tattoo Studio",
    title: "The Bowery Street | Studio de Tatouage à Lorient",
    description: "Studio de tatouage professionnel à Lorient. Miss Bunny, Manolita et Lisa. Tatouages personnalisés depuis août 2024.",
    images: [{ url: "/logo.jpg", width: 1200, height: 630, alt: "The Bowery Street Tattoo Studio Lorient" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Bowery Street | Studio de Tatouage à Lorient",
    description: "Studio de tatouage professionnel à Lorient avec 3 artistes passionnés.",
    images: ["/logo.jpg"],
  },
  alternates: {
    canonical: "https://theboweryst.fr/",
    languages: {
      'fr': 'https://theboweryst.fr/',
      'en': 'https://theboweryst.fr/en',
      'x-default': 'https://theboweryst.fr/',
    },
  },
};

export default function FrLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider initialLocale="fr">
      {children}
    </I18nProvider>
  );
}
