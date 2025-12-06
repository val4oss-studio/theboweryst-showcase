import { getPostById } from '@/domain/services/postService';
import { postIdSchema } from '@/validators/postValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: pnpm db:posts:get <id>');
  process.exit(1);
}

const parsed = postIdSchema.safeParse({ id: args[0] });
if (!parsed.success) {
  console.error('Validation errors:');
  formatZodErrors(parsed.error).forEach(msg => console.error(msg));
  process.exit(1);
}

try {
  const post = getPostById(parsed.data.id);
  if (!post) {
    console.error(`Post with ID ${parsed.data.id} not found.`);
    process.exit(1);
  }
  console.log(`ID          : ${post.id}`);
  console.log(`Artist ID   : ${post.artistId}`);
  console.log(`URL         : ${post.postUrl}`);
  console.log(`coverURL    : ${post.coverImageUrl}`);
  console.log(`Description : ${post.description ?? 'none'}`);
  console.log(`Likes       : ${post.likeCount}`);
  console.log(`Comments    : ${post.commentCount}`);
  console.log(`Media (${post.mediaUrls.length}):`);
  post.mediaUrls.forEach((url, i) => {
    console.log(`  [${i + 1}] ${url}`);
  });
} catch (error) {
  console.error('Error getting post:', error);
  process.exit(1);
}
