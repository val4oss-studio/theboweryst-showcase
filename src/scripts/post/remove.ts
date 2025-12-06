import { deletePost, getPostById } from '@/domain/services/postService';
import { postIdSchema } from '@/validators/postValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: pnpm db:posts:remove <id>');
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

  deletePost(parsed.data.id);
  console.log(`Post [${post.id}] from artist [${post.artistId}] removed successfully.`);
} catch (error) {
  console.error('Error removing post:', error);
  process.exit(1);
}

