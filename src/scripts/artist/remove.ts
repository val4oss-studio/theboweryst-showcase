import { deleteArtist, getArtistById } from '@/domain/services/artistService';
import { artistIdSchema } from '@/validators/artistValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: pnpm artists:remove <id>');
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

  deleteArtist(parsed.data.id);
  console.log(`Artist [${artist.id}] "${artist.username}" removed successfully.`);
} catch (error) {
  console.error('Error removing artist:', error);
  process.exit(1);
}
