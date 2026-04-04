import { existsSync, createReadStream } from 'fs'
import { Readable } from 'stream'
import path from 'path'
import { type NextRequest, NextResponse } from 'next/server'

const POSTS_DIR = process.env.SYNC_POSTS_DIR
  ?? path.join(process.cwd(), 'data/posts')

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const filePath = path.resolve(POSTS_DIR, filename)

  if (
    !filePath.startsWith(path.resolve(POSTS_DIR)) ||
    !existsSync(filePath)
  ) {
    return new NextResponse(null, { status: 404 })
  }

  const stream = Readable.toWeb(
    createReadStream(filePath)
  ) as ReadableStream

  return new Response(stream, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
