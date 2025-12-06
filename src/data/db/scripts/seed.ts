import { ArtistRepository } from "@/data/repositories/artistRepository";
import { PostRepository } from "@/data/repositories/postRepository";
import { ShopRepository } from "@/data/repositories/shopRepository";
import { closeDb } from "@/data/db/client";

/**
 * Seed data for the artists table.
 * This array contains objects representing artists with their username,
 * Instagram ID, and bio.
 */
const seedArtists = [
  {
    username:    "Miss Bunny",
    instagramId: "missbunnytattoo",
    bio: {
      fr: "Souvent contactée pour des projets en réalisme, principalement animalier et portrait, mais je fais aussi beaucoup de petits motifs comme du floral",
      en: "Often approached for realism projects, mainly animal and portrait, but I also do a lot of small designs like florals",
    },
    profilePicture: "/artists/missbunny.jpeg",
  },
  {
    username:    "Manolita",
    instagramId: "manolita_ink",
    bio: {
      fr: "Je réalise toutes sortes de style mais mes domaines de prédilection sont le neotraditionnel couleur et le blackwork!",
      en: "I work in all styles but my specialties are color neotraditional and blackwork!",
    },
    profilePicture: "/artists/manolita.jpeg",
  },
  {
    username:    "Lisa",
    instagramId: "lisayekita",
    bio: {
      fr: "Mon travail est inspiré des codes du tatouage traditionnel américain, européen et ornemental.",
      en: "My work is inspired by the codes of American traditional, European, and ornamental tattooing.",
    },
    profilePicture: "/artists/lisa.jpeg",
  },
];

const seedShop = {
  name: "The Bowery Street",
  description: {
    fr: "Studio de tatouage professionnel à Lorient, France. Trois artistes passionnés créent des œuvres d'art corporel uniques depuis août 2024.",
    en: "Professional tattoo studio in Lorient, France. Three passionate artists creating unique body art since August 2024.",
  },
  addressStreet:     "6 Rue de Turenne",
  addressCity:       "Lorient",
  addressZip:        "56100",
  addressCountry:    "France",
  mapUrl:            "https://www.google.com/maps/search/?api=1&query=6+Rue+Turenne+56100+Lorient",
  instagramUrl:      "https://www.instagram.com/theboweryst/",
  instagramUsername: "theboweryst",
  facebookUrl:       "https://www.facebook.com/share/1DpTvDjBrQ",
  facebookUsername:  "The Bowery Street",
  scheduleWeekdays: {
    fr: "Mardi - Samedi : 11h - 18h",
    en: "Tuesday - Saturday: 11am - 6pm",
  },
  scheduleWeekend: {
    fr: "Dimanche - Lundi : Fermé",
    en: "Sunday - Monday: Closed",
  },
};

function seed() {
  console.log('Starting database seeding...');
  const artistRepo = new ArtistRepository();

  const existingArtists = artistRepo.findAll();
  if (existingArtists.length > 0) {
    console.log(`${existingArtists.length} artist(s) already exist. Aborting to prevent duplicates.`);
    return;
  }

  let errCount = 0;
  for (const data of seedArtists) {
    try {
      const artist = artistRepo.create(data);
      console.log(`Added artist: ${artist.username} (ID: ${artist.id})`);
    } catch (error) {
      console.error(`Error adding artist "${data.username}":`, error);
      errCount++;
    }
  }

  const shopRepo = new ShopRepository();
  if (shopRepo.findFirst()) {
    console.log('Shop already exists. Skipping.');
  } else {
    try {
      const shop = shopRepo.create(seedShop);
      console.log(`Added shop: ${shop.name}`);
    } catch (error) {
      console.error('Error adding shop:', error);
    }
  }

  console.log(`\nSeeding Summary:`);
  console.log(`Artists seeded: ${seedArtists.length - errCount}/${seedArtists.length}`);
  console.log('Database seeding completed.');
}

try {
  seed();
} catch(error) {
  console.error('Seeding failed:', error);
  process.exit(1);
} finally {
  closeDb();
}
