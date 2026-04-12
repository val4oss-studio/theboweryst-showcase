import { cache } from "react";
import { Navbar, Footer, SnapScroll } from "@/app/components/layout";
import {
  HeroSection,
  AboutSection,
  ArtistsSection,
  GallerySection,
  ContactSection,
} from "@/app/components/sections";
import { SECTION_IDS } from '@/config/sections';
import { getAllArtists } from "@/domain/services/artistService";
import { getShop } from "@/domain/services/shopService";

export const revalidate = 3

const getCachedArtists = cache(getAllArtists);
const getCachedShop = cache(getShop);

export default async function Home() {
  const artists = await getCachedArtists();
  const shop = await getCachedShop();

  if (!shop) {
    throw new Error("Shop data not found. Please add information in database.");
  }

  return (
    <>
      <Navbar />
      <SnapScroll />
      <HeroSection id={SECTION_IDS.home} shop={shop}/>
      <AboutSection id={SECTION_IDS.about} />
      <ArtistsSection id={SECTION_IDS.artists} artists={artists}/>
      <GallerySection id={SECTION_IDS.gallery} artists={artists}/>
      <ContactSection id={SECTION_IDS.contact} shop={shop} artists={artists}/>
      <Footer shop={shop} artists={artists}/>
    </>
  );
}
