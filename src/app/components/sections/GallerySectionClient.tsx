"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/app/i18n/provider";
import { InstagramCard } from "@/app/components/layout/InstagramCard";
import {
  getArtistInstagramUrl,
  getArtistPhoto,
  type Artist,
} from '@/content/artists';
import type { InstagramFeed } from '@/content/instagram';

interface GallerySectionClientProps {
  artists: Artist[];
  /** `null` when val4oss-media could not give the feed of the artist. */
  feedsByArtistId: Record<string, InstagramFeed | null>;
}

const AUTO_CYCLE_INTERVAL = 5000; // 5 seconds
const PREVIEW_COUNT = 12;

export function GallerySectionClient({ artists, feedsByArtistId }: GallerySectionClientProps) {
  const { t } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isAutoPlay || artists.length <= 1) return;

    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      setFadeState('out');
      fadeTimeout = setTimeout(() => {
        setSelectedIndex((prev) => (prev + 1) % artists.length);
        setFadeState('in');
        fadeTimeout = null;
      }, 300);
    }, AUTO_CYCLE_INTERVAL);

    return () => {
      clearInterval(interval);
      if (fadeTimeout !== null) {
        clearTimeout(fadeTimeout);
        setFadeState('in');
      }
    };
  }, [isAutoPlay, artists.length]);

  const handleArtistClick = (index: number) => {
    setIsAutoPlay(false);
    setFadeState('out');
    setTimeout(() => {
      setSelectedIndex(index);
      setFadeState('in');
    }, 300);
  };

  // Block the background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // Opening a post stops the cycle: switching artist would unmount its dialog.
  const stopAutoPlay = () => setIsAutoPlay(false);

  const currentArtist = artists[selectedIndex];
  const currentFeed = currentArtist ? feedsByArtistId[currentArtist.id] : null;
  const currentPosts = currentFeed?.posts ?? [];
  const previewPosts = currentPosts.slice(0, PREVIEW_COUNT);
  const hasMore = currentPosts.length > PREVIEW_COUNT;
  const profileUrl = currentFeed?.profileUrl
    ?? (currentArtist ? getArtistInstagramUrl(currentArtist) : undefined);

  return (
    <div className="section-container">
      <div className="section-header">
        <h2 className="section-title">{t.gallery.title}</h2>
      </div>

      <div className="artist-selector">
        {artists.map((artist, index) => (
          <button
            key={artist.id}
            onClick={() => handleArtistClick(index)}
            className={`artist-avatar ${selectedIndex === index ? 'active' : ''}`}
            aria-label={t.gallery.viewArtist.replace('{name}', artist.name)}
          >
            <div className="artist-avatar-image-wrapper">
              <Image
                src={getArtistPhoto(artist)}
                alt={artist.name}
                width={80}
                height={80}
                className="artist-avatar-image"
              />
            </div>
            <span className="artist-avatar-name">{artist.name}</span>
          </button>
        ))}
      </div>

      {currentPosts.length === 0 ? (
        <div className={`gallery-empty gallery-fade-${fadeState}`}>
          <p className="gallery-placeholder">
            {t.gallery.unavailable.replace('{name}', currentArtist?.name ?? '')}
          </p>
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-empty-link"
            >
              {t.gallery.viewProfile}
            </a>
          )}
        </div>
      ) : (
        <div
          className={`gallery-grid gallery-fade-${fadeState}`}
          onClickCapture={stopAutoPlay}
        >
          {previewPosts.map((post, index) => {
            const isMoreTrigger = hasMore && index === PREVIEW_COUNT - 1;

            if (isMoreTrigger) {
              return (
                <button
                  key={post.shortcode}
                  onClick={() => setIsModalOpen(true)}
                  className="gallery-item gallery-item-more"
                  aria-label={t.gallery.viewAll}
                >
                  <Image
                    src={post.cover}
                    alt=""
                    fill
                    sizes="(max-width: 40rem) 50vw, 20rem"
                    className="gallery-image"
                  />
                  <div className="gallery-more-overlay">
                    <MoreHorizontal className="gallery-more-icon" />
                  </div>
                </button>
              );
            }

            return <InstagramCard key={post.shortcode} post={post} />;
          })}
        </div>
      )}

      {/* Modal all posts */}
      {isModalOpen && (
        <div
          className="gallery-modal"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t.gallery.allPosts}
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gallery-modal-header">
              <h3 className="gallery-modal-title">
                {currentArtist?.name} — {currentPosts.length} posts
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="gallery-modal-close"
                aria-label={t.gallery.close}
              >
                <X size={18} />
              </button>
            </div>
            <div className="gallery-modal-grid">
              {currentPosts.map((post) => (
                <InstagramCard key={post.shortcode} post={post} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
