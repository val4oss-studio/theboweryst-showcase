import { createArtist } from '@/domain/services/artistService';
import { createArtistSchema } from '@/validators/artistValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 4) {
  console.error(
    'Usage: pnpm artists:add <username> <instagramId> <bio_fr> <bio_en> [profilePicture]'
  );
  process.exit(1);
}

const [username, instagramId, bio_fr, bio_en, profilePicture] = args;

// Validate input using Zod schema
const parsed = createArtistSchema.safeParse({
  username,
  instagramId,
  bio: { fr: bio_fr, en: bio_en },
  profilePicture,
});

if (!parsed.success) {
  console.error('Validation error:');
  formatZodErrors(parsed.error).forEach(msg => console.error(msg));
  process.exit(1);
}

try {
  const artist = createArtist(parsed.data);
  console.log(`  ID            : ${artist.id}`);
  console.log(`  Username      : ${artist.username}`);
  console.log(`  Instagram     : ${artist.instagramName}`);
  console.log(`  Bio FR        : ${artist.bio.fr}`);
  console.log(`  Bio EN        : ${artist.bio.en}`);
  console.log(`  ProfilePicture: ${artist.profilePicture}`);
} catch (error) {
  console.error('Error adding artist:', error);
  process.exit(1);
}
