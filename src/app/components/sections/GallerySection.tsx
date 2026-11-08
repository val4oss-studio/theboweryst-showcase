import { Suspense } from 'react';
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import type { InstagramFeed } from '@/content/instagram';
import { getInstagramFeed } from '@/content/instagramFeed';
import { GallerySectionClient } from './GallerySectionClient';

interface GalleryContentProps {
  artists: ArtistEntity[];
}

/**
 * Fetches the Instagram feed of every artist from val4oss-media, together.
 * Each one fails alone: `null` renders a link to the artist's profile.
 */
async function GalleryContent({ artists }: GalleryContentProps) {
  const feeds = await Promise.all(
    artists.map((artist) => getInstagramFeed(artist.instagramName))
  );

  const feedsByArtistId: Record<number, InstagramFeed | null> = {};
  artists.forEach((artist, index) => {
    feedsByArtistId[artist.id] = feeds[index];
  });

  return (
    <GallerySectionClient
      artists={artists}
      feedsByArtistId={feedsByArtistId}
    />
  );
}

function GallerySkeleton() {
  return (
    <div className="section-container">
      <div className="section-header">
        <div className="skeleton skeleton-title" />
      </div>
      <div className="artist-selector">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="skeleton skeleton-avatar" />
        ))}
      </div>
      <div className="gallery-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </div>
  );
}

interface GallerySectionProps {
  id: string;
  artists: ArtistEntity[];
}

export function GallerySection({ id, artists }: GallerySectionProps) {
  return (
    <section id={id} className="section">
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent artists={artists} />
      </Suspense>
    </section>
  );
}
