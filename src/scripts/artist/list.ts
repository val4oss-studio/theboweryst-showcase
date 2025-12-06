import { getAllArtists } from '@/domain/services/artistService';

try {
  const artists = getAllArtists();

  if (artists.length === 0) {
    console.log('No artists in the database.');
  } else {
    console.log(`Artists (${artists.length}):\n`);
    artists.forEach((artist) => {
      console.log(`  [${artist.id}] ${artist.username}`);
      console.log(`       Instagram     : ${artist.instagramName}`);
      console.log(`       Bio FR        : ${artist.bio.fr}`);
      console.log(`       Bio EN        : ${artist.bio.en}`);
      console.log(`       ProfilePicture: ${artist.profilePicture}`);
      console.log('');
    });
  }
} catch (error) {
  console.error('Error listing artists:', error);
  process.exit(1);
}
