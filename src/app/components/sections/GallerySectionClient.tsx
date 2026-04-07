"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, MoreHorizontal } from "lucide-react";
import { useI18n } from "@/app/i18n/provider";
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import type { PostEntity } from '@/domain/entities/postEntity';
import { getArtistProfileImage } from '@/domain/entities/artistEntity';

interface GallerySectionClientProps {
  artists: ArtistEntity[];
  postsByArtistId: Record<number, PostEntity[]>;
}

const AUTO_CYCLE_INTERVAL = 5000; // 5 seconds
const PREVIEW_COUNT = 12;

export function GallerySectionClient({ artists, postsByArtistId }: GallerySectionClientProps) {
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


  const currentArtist = artists[selectedIndex];
  const currentPosts = currentArtist ? (postsByArtistId[currentArtist.id] ?? []) : [];
  const previewPosts = currentPosts.slice(0, PREVIEW_COUNT);
  const hasMore = currentPosts.length > PREVIEW_COUNT;

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
            aria-label={`View ${artist.username}'s gallery`}
          >
            <div className="artist-avatar-image-wrapper">
              <Image
                src={getArtistProfileImage(artist)}
                alt={artist.username}
                width={80}
                height={80}
                className="artist-avatar-image"
              />
            </div>
            <span className="artist-avatar-name">{artist.username}</span>
          </button>
        ))}
      </div>

      <div className={`gallery-grid gallery-fade-${fadeState}`}>
        
        {previewPosts.map((post, index) => {
          const isMoreTrigger = hasMore && index === PREVIEW_COUNT - 1;

          if (isMoreTrigger) {
            return (
              <button
                key={post.id}
                onClick={() => {setIsModalOpen(true); setIsAutoPlay(false);}}
                className="gallery-item gallery-item-more"
                aria-label="Voir tous les posts"
              >
                <Image
                  src={post.coverImageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 150px, 250px"
                  className="gallery-image"
                  unoptimized
                  loading="eager"
                />
                <div className="gallery-more-overlay">
                  <MoreHorizontal className="gallery-more-icon" />
                </div>
              </button>
            );
          }

          return (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gallery-item"
              aria-label={post.description ?? `Post by ${currentArtist?.username}`}
            >
              <Image
                src={post.coverImageUrl}
                alt={post.description ?? `Post by ${currentArtist?.username}`}
                fill
                sizes="(max-width: 768px) 150px, 250px"
                className="gallery-image"
                unoptimized
                loading="eager"
              />
            </a>
          );
        })}

      </div>

      {/* Modal all posts */}
      {isModalOpen && (
        <div
          className="gallery-modal"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Tous les posts"
        >
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gallery-modal-header">
              <h3 className="gallery-modal-title">
                {currentArtist?.username} — {currentPosts.length} posts
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="gallery-modal-close"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="gallery-modal-grid">
              {currentPosts.map((post) => (
                <a
                  key={post.id}
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-item"
                  aria-label={post.description ?? `Post by ${currentArtist?.username}`}
                >
                  <Image
                    src={post.coverImageUrl}
                    alt={post.description ?? `Post by ${currentArtist?.username}`}
                    fill
                    sizes="(max-width: 768px) 150px, 250px"
                    className="gallery-image"
                    unoptimized
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
