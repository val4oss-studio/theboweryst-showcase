import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { I18nProvider } from "./i18n/provider";
import { VideoBackground } from "@/app/components/layout/VideoBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://theboweryst.fr'),
  title: {
    default: "The Bowery Street | Studio de Tatouage Professionnel à Lorient, Bretagne",
    template: "%s | The Bowery Street Tattoo"
  },
  description: "The Bowery Street (The Boweryst) - Studio de tatouage professionnel à Lorient, Bretagne. 3 artistes tatoueurs passionnés : Miss Bunny, Manolita et Lisa. Tatouages personnalisés et créations uniques depuis août 2024. 6 Rue Turenne, 56100 Lorient.",
  keywords: [
    "tatouage lorient",
    "tattoo lorient",
    "studio tatouage lorient",
    "the boweryst",
    "the bowery street",
    "bowery street lorient",
    "tatoueur lorient",
    "tatouage bretagne",
    "tattoo bretagne",
    "tatouage morbihan",
    "studio tatouage bretagne",
    "miss bunny tattoo",
    "manolita ink",
    "lisa yekita",
    "tatouage professionnel lorient",
    "salon tatouage lorient",
    "artiste tatoueur lorient",
    "tatouage sur mesure lorient",
    "custom tattoo lorient",
    "tatouage artistique",
    "tattoo shop lorient",
    "56100 lorient tattoo",
    "rue turenne tatouage"
  ],
  authors: [{ name: "The Bowery Street Tattoo Studio" }],
  creator: "The Bowery Street",
  publisher: "The Bowery Street",
  formatDetection: {
    email: false,
    address: true,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: "https://theboweryst.fr",
    siteName: "The Bowery Street Tattoo Studio",
    title: "The Bowery Street | Studio de Tatouage à Lorient",
    description: "Studio de tatouage professionnel à Lorient, Bretagne. 3 artistes tatoueurs talentueux : Miss Bunny, Manolita et Lisa. Tatouages personnalisés depuis août 2024.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "The Bowery Street Tattoo Studio Lorient",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Bowery Street | Studio de Tatouage à Lorient",
    description: "Studio de tatouage professionnel à Lorient, Bretagne avec 3 artistes tatoueurs passionnés.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'business',
  classification: 'Tattoo Studio',
  other: {
    'geo.region': 'FR-BRE',
    'geo.placename': 'Lorient',
    'geo.position': '47.748889;-3.366667',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://theboweryst.fr" />
        <link rel="alternate" hrefLang="fr" href="https://theboweryst.fr" />
        <link rel="alternate" hrefLang="en" href="https://theboweryst.fr/en" />
        <link rel="alternate" hrefLang="x-default" href="https://theboweryst.fr" />
        
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `}
        </Script>
        <Script id="locale-script" strategy="beforeInteractive">
          {`
            (function() {
              const locale = localStorage.getItem('locale') || 'fr';
              document.documentElement.setAttribute('lang', locale);
            })();
          `}
        </Script>
        
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TattooParlor",
              "@id": "https://theboweryst.fr/#organization",
              name: "The Bowery Street",
              alternateName: ["The Boweryst", "Bowery Street Tattoo"],
              description: "Studio de tatouage professionnel à Lorient, Bretagne avec 3 artistes tatoueurs passionnés",
              url: "https://theboweryst.fr",
              logo: "https://theboweryst.fr/logo.jpg",
              image: "https://theboweryst.fr/logo.jpg",
              telephone: "",
              email: "",
              address: {
                "@type": "PostalAddress",
                streetAddress: "6 Rue de Turenne",
                addressLocality: "Lorient",
                postalCode: "56100",
                addressRegion: "Bretagne",
                addressCountry: "FR"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 47.748889,
                longitude: -3.366667
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "11:00",
                  closes: "18:00"
                }
              ],
              sameAs: [
                "https://www.instagram.com/theboweryst/",
                "https://www.facebook.com/share/1DpTvDjBrQ",
                "https://www.instagram.com/missbunnytattoo/",
                "https://www.instagram.com/manolita_ink/",
                "https://www.instagram.com/lisayekita/"
              ],
              priceRange: "$$",
              foundingDate: "2024-08",
              areaServed: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 47.748889,
                  longitude: -3.366667
                },
                geoRadius: "50000"
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Services de tatouage",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Tatouage personnalisé",
                      description: "Créations de tatouages uniques et sur mesure"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Tatouage artistique",
                      description: "Tatouages artistiques par des artistes professionnels"
                    }
                  }
                ]
              },
              employee: [
                {
                  "@type": "Person",
                  name: "Miss Bunny",
                  jobTitle: "Artiste Tatoueur",
                  sameAs: "https://www.instagram.com/missbunnytattoo/"
                },
                {
                  "@type": "Person",
                  name: "Manolita",
                  jobTitle: "Artiste Tatoueur",
                  sameAs: "https://www.instagram.com/manolita_ink/"
                },
                {
                  "@type": "Person",
                  name: "Lisa",
                  jobTitle: "Artiste Tatoueur",
                  sameAs: "https://www.instagram.com/lisayekita/"
                }
              ]
            })
          }}
        />

        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Accueil",
                  item: "https://theboweryst.fr"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "À Propos",
                  item: "https://theboweryst.fr#about"
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Artistes",
                  item: "https://theboweryst.fr#artists"
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Galerie",
                  item: "https://theboweryst.fr#gallery"
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Contact",
                  item: "https://theboweryst.fr#contact"
                }
              ]
            })
          }}
        />

        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://theboweryst.fr/#localbusiness",
              name: "The Bowery Street - Studio de Tatouage Lorient",
              image: "https://theboweryst.fr/logo.jpg",
              description: "Studio de tatouage professionnel à Lorient avec 3 artistes tatoueurs passionnés",
              address: {
                "@type": "PostalAddress",
                streetAddress: "6 Rue de Turenne",
                addressLocality: "Lorient",
                postalCode: "56100",
                addressRegion: "Bretagne",
                addressCountry: "FR"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 47.748889,
                longitude: -3.366667
              },
              url: "https://theboweryst.fr",
              openingHours: "Tu-Sa 11:00-18:00",
              priceRange: "$$"
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <VideoBackground />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
