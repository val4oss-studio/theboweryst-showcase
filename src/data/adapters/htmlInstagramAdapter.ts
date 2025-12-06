import { readFileSync } from 'fs'
import * as cheerio from 'cheerio'
import path from 'path'

export interface ParsedInstagramPost {
  shortcode: string
  instagramUrl: string
  cdnImageUrl: string
  description: string | null
  isCarousel: boolean
}

export function parseInstagramHtml(
  instagramUsername: string,
  htmlDir: string
): ParsedInstagramPost[] {
  const htmlPath = path.join(htmlDir, `${instagramUsername}.html`)
  const html = readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)

  const posts: ParsedInstagramPost[] = []

  $(`a[href*="/${instagramUsername}/p/"]`).each((_, el) => {
    const href = $(el).attr('href') ?? ''
    const match = href.match(/\/p\/([^/]+)\//)
    if (!match) return

    const shortcode = match[1]
    const img = $(el).find('img').first()
    const cdnImageUrl = img.attr('src') ?? ''
    const description = img.attr('alt') || null
    const isCarousel = $(el).find('svg[aria-label="Carousel"]').length > 0

    if (!cdnImageUrl) return

    posts.push({
      shortcode,
      instagramUrl: `https://www.instagram.com/p/${shortcode}/`,
      cdnImageUrl,
      description,
      isCarousel,
    })
  })

  return posts
}
