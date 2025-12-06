import { Suspense, cache } from 'react';
import { getPostsByArtistId } from '@/domain/services/postService';
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import type { PostEntity } from '@/domain/entities/postEntity';
import { GallerySectionClient } from './GallerySectionClient';

interface GallerySectionProps {
  artists: ArtistEntity[];
}

const  getCachedPostsByArtist = cache(getPostsByArtistId);

async function GalleryContent({ artists }: GallerySectionProps) {
  const postsByArtistId: Record<number, PostEntity[]> = {};

  for (const artist of artists) {
    postsByArtistId[artist.id] = await getCachedPostsByArtist(artist.id);
  }

  return (
    <GallerySectionClient
      artists={artists}
      postsByArtistId={postsByArtistId}
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

export function GallerySection({ artists }: GallerySectionProps) {
  return (
    <section id="gallery" className="section">
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent artists={artists} />
      </Suspense>
    </section>
  );
}
