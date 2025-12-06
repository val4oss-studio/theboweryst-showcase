export const dynamic = 'force-dynamic';

import { cache } from "react";
import { Navbar, Footer } from "@/app/components/layout";
import {
  HeroSection,
  AboutSection,
  ArtistsSection,
  GallerySection,
  ContactSection,
} from "@/app/components/sections";
import { getAllArtists } from "@/domain/services/artistService";
import { getShop } from "@/domain/services/shopService";

const getCachedArtists = cache(getAllArtists);
const getCachedShop = cache(getShop);

export default async function Home() {
  const artists = await getCachedArtists();
  const shop = await getCachedShop();

  if ( !shop ) {
    throw new Error("Shop data not found. Please add information in database.");
  }

  return (
    <>
      <Navbar />
      <HeroSection  shop={shop}/>
      <AboutSection />
      <ArtistsSection artists={artists}/>
      <GallerySection artists={artists}/>
      <ContactSection shop={shop} artists={artists}/>
      <Footer shop={shop} artists={artists}/>
    </>
  );
}
