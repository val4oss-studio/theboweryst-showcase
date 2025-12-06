import { createPost } from '@/domain/services/postService';
import { createPostSchema } from '@/validators/postValidator';
import { formatZodErrors } from '@/validators/utils';

const args = process.argv.slice(2);
if (args.length < 6) {
  console.error(
    'Usage: pnpm posts:add <artistId> <postUrl> <likeCount> <commentCount> <description|""> <mediaUrl1> [mediaUrl2 ...]'
  );
  process.exit(1);
}

const [artistId, postUrl, likeCount, commentCount, description, ...mediaUrls] = args;

const parsed = createPostSchema.safeParse({
  artistId,
  postUrl,
  likeCount,
  commentCount,
  description: description === '' ? null : description,
  mediaUrls,
});

if (!parsed.success) {
  console.error('Validation errors:');
  formatZodErrors(parsed.error).forEach(msg => console.error(msg));
  process.exit(1);
}

try {
  const post = createPost(parsed.data);
  console.log('Post added successfully:');
  console.log(`  ID          : ${post.id}`);
  console.log(`  Artist ID   : ${post.artistId}`);
  console.log(`  URL         : ${post.postUrl}`);
  console.log(`  Media count : ${post.mediaUrls.length}`);
  console.log(`  Likes       : ${post.likeCount}`);
  console.log(`  Comments    : ${post.commentCount}`);
} catch (error) {
  console.error('Error adding post:', error);
  process.exit(1);
}
