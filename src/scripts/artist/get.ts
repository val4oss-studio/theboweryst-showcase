import { getArtistById } from '@/domain/services/artistService';
import { artistIdSchema } from '@/validators/artistValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: pnpm artists:get <id>');
  process.exit(1);
}

const parsed = artistIdSchema.safeParse({ id: args[0] });
if (!parsed.success) {
  console.error('Validation errors:');
  formatZodErrors(parsed.error).forEach(msg => console.error(msg));
  process.exit(1);
}

try {
  const artist = getArtistById(parsed.data.id);
  if (!artist) {
    console.error(`Artist with ID ${parsed.data.id} not found.`);
    process.exit(1);
  }
  console.log(`ID       : ${artist.id}`);
  console.log(`Username : ${artist.username}`);
  console.log(`Instagram: ${artist.instagramName}`);
  console.log(`Bio FR   : ${artist.bio.fr}`);
  console.log(`Bio EN   : ${artist.bio.en}`);
  console.log(`Picture  : ${artist.profilePicture ?? 'none'}`);
} catch (error) {
  console.error('Error getting artist:', error);
  process.exit(1);
}
