import { getAllPosts } from '@/domain/services/postService';

const args = process.argv.slice(2);
const artistIdFilter = args[0] ? Number(args[0]) : undefined;

try {
  const posts = getAllPosts();
  const filtered = artistIdFilter
    ? posts.filter((p) => p.artistId === artistIdFilter)
    : posts;

  if (filtered.length === 0) {
    console.log('No posts found.');
  } else {
    console.log(`Posts (${filtered.length}):\n`);
    filtered.forEach((post) => {
      console.log(`  [${post.id}] Post: ${post.artistId}`);
      console.log(`       URL     : ${post.postUrl}`);
      console.log(`       Media   : ${post.mediaUrls.length} file(s)`);
      console.log(`       Likes   : ${post.likeCount} | Comments: ${post.commentCount}`);
      console.log('');
    });
  }
} catch (error) {
  console.error('Error listing posts:', error);
  process.exit(1);
}
