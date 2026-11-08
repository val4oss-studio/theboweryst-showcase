import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { headers } from "next/headers";
import { defaultLocale, locales } from "@/config/locales";
import { LOCALE_HEADER, SEO_TEXT, SITE_URL } from "@/config/seo";
import { shop } from "@/content/shop";
import { VideoBackground } from "@/app/components/layout/VideoBackground";

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO_TEXT.title.fr,
    template: "%s | The Bowery Street",
  },
  description: SEO_TEXT.description.fr,
  applicationName: "The Bowery Street",
  authors: [{ name: "The Bowery Street", url: SITE_URL }],
  creator: "The Bowery Street",
  publisher: "The Bowery Street",
  formatDetection: {
    email: false,
    address: true,
    telephone: false,
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
  category: 'business',
  other: {
    'geo.region': shop.regionCode,
    'geo.placename': 'Lorient',
    'geo.position': `${shop.latitude};${shop.longitude}`,
    ICBM: `${shop.latitude}, ${shop.longitude}`,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set by the proxy from the path: `/en` → `en`, anything else → French.
  const headerLocale = (await headers()).get(LOCALE_HEADER);
  const lang = locales.find((locale) => locale === headerLocale) ?? defaultLocale;

  return (
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <VideoBackground />
        {children}
      </body>
    </html>
  );
}
