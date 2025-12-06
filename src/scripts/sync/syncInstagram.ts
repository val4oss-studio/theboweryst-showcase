import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { getAllArtists } from '@/domain/services/artistService'
import { createPost, deletePostsByArtistId } from '@/domain/services/postService'
import { closeDb } from '@/data/db/client'
import { parseInstagramHtml } from '@/data/adapters/htmlInstagramAdapter'

const HTML_DIR = process.env.SYNC_HTML_DIR
  ?? path.join(process.cwd(), 'src/scripts/sync')
const POSTS_DATA_DIR = process.env.SYNC_POSTS_DIR
    ?? path.join(process.cwd(), 'public/posts')

async function downloadImage(url: string, destPath: string): Promise<void> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.instagram.com/',
    },
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  writeFileSync(destPath, Buffer.from(await response.arrayBuffer()))
}

async function syncArtist(artistId: number, instagramUsername: string): Promise<void> {
  console.log(`  Syncing @${instagramUsername}...`)

  const posts = parseInstagramHtml(instagramUsername, HTML_DIR)
  console.log(`    Found ${posts.length} posts in HTML`)

  const artistDir = path.join(POSTS_DATA_DIR, instagramUsername)
  mkdirSync(artistDir, { recursive: true })

  deletePostsByArtistId(artistId)

  let savedCount = 0
  for (const post of posts) {
    const filename = `${post.shortcode}.jpg`
    const destPath = path.join(artistDir, filename)
    const localUrl = `/posts/${instagramUsername}/${filename}`

    if (!existsSync(destPath)) {
      try {
        await downloadImage(post.cdnImageUrl, destPath)
      } catch (err) {
        console.warn(`    ⚠ Failed to download ${post.shortcode}: ${err}`)
        continue
      }
    }

    createPost({
      artistId,
      postUrl: post.instagramUrl,
      coverImageUrl: localUrl,
      mediaUrls: [localUrl],
      description: post.description,
      likeCount: 0,
      commentCount: 0,
    })
    savedCount++
  }

  console.log(`    ✓ ${savedCount}/${posts.length} posts synced`)
}

async function syncAllArtists(): Promise<void> {
  console.log('Starting HTML sync...\n')

  const artists = getAllArtists()
  if (artists.length === 0) {
    console.log('No artists found. Aborting.')
    return
  }

  let successCount = 0
  let errorCount = 0

  for (const artist of artists) {
    try {
      await syncArtist(artist.id, artist.instagramName)
      successCount++
    } catch (error) {
      console.error(`  ✗ Failed to sync @${artist.instagramName}:`, error)
      errorCount++
    }
  }

  console.log(`\nSync complete — ✓ ${successCount} synced, ✗ ${errorCount} failed`)
}

syncAllArtists()
  .catch((error) => {
    console.error('Sync failed:', error)
    process.exit(1)
  })
  .finally(() => {
    closeDb()
  })
