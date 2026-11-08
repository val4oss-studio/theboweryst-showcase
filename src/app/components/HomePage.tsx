import { connection } from "next/server";
import { Navbar, Footer, StructuredData } from "@/app/components/layout";
import {
  HeroSection,
  AboutSection,
  ArtistsSection,
  GallerySection,
  ContactSection,
} from "@/app/components/sections";
import type { Locale } from "@/config/locales";
import { SECTION_IDS } from "@/config/sections";
import { artists } from "@/content/artists";
import { getActiveGuests } from "@/content/guests";

interface HomePageProps {
  locale: Locale;
}

/** The one-page site, shared by `/` (fr) and `/[locale]`. */
export async function HomePage({ locale }: HomePageProps) {
  // Rendered on request: guests come and go with the date.
  await connection();
  const guests = getActiveGuests();

  return (
    <>
      <StructuredData locale={locale} residents={artists} guests={guests} />
      <Navbar />
      <HeroSection id={SECTION_IDS.home} />
      <AboutSection id={SECTION_IDS.about} />
      <ArtistsSection id={SECTION_IDS.artists} artists={artists} guests={guests} />
      <GallerySection id={SECTION_IDS.gallery} artists={artists} />
      <ContactSection id={SECTION_IDS.contact} artists={artists} />
      <Footer artists={artists} />
    </>
  );
}
