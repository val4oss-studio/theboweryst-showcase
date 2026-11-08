'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { JSX, MouseEvent } from 'react';
import Image from 'next/image';

import { useI18n } from '@/app/i18n/provider';
import { cx } from '@/app/lib/utils/cx';
import { formatInstagramCount, type InstagramMedia, type InstagramPost } from '@/content/instagram';

type IconName =
  'heart' | 'comment' | 'image' | 'carousel' | 'reel' | 'play' | 'prev' | 'next' | 'close';

const ICON_PATHS: Record<IconName, string> = {
  heart:
    'M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.7 4.5c2 0 3.6 1.1 4.3 2.6h2c.7-1.5 2.3-2.6 4.3-2.6 3.7 0 5.8 3.8 4.3 7.2C19.5 16.4 12 21 12 21Z',
  comment:
    'M12 3.5c-5 0-9 3.5-9 7.9 0 2.3 1.1 4.4 2.9 5.8L5 21l4.4-2.1c.8.2 1.7.3 2.6.3 5 0 9-3.5 9-7.9s-4-7.8-9-7.8Z',
  image:
    'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 13h14l-4.5-6-3.5 4.5-2.5-3L5 17Z',
  carousel:
    'M8 3h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM3 8h1.5v10.5A1.5 1.5 0 0 0 6 20h10.5v1.5H6A3 3 0 0 1 3 18.5V8Z',
  reel: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm5 5.5v7l6-3.5-6-3.5Z',
  prev: 'M14.7 5.3a1 1 0 0 1 0 1.4L9.4 12l5.3 5.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z',
  play: 'M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z',
  next: 'M9.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.4Z',
  close:
    'M6.7 5.3 12 10.6l5.3-5.3a1 1 0 1 1 1.4 1.4L13.4 12l5.3 5.3a1 1 0 0 1-1.4 1.4L12 13.4l-5.3 5.3a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 1.4-1.4Z',
};

/** Decorative icon: its meaning is always carried by a visible or sr-only text. */
function Icon({ name, className }: { name: IconName; className?: string }): JSX.Element {
  return (
    <svg className={cx('ig-icon', className)} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/**
 * First caption line without its hashtags, used as alt text (the caption is the
 * only description we have). Emoji-only lines fall back to a generic label.
 */
function altFromCaption(caption: string, fallback: string): string {
  const firstLine = caption.split('\n')[0].replace(/#\S+/g, '').replace(/\s+/g, ' ').trim();
  return /[A-Za-zÀ-ÿ0-9]/.test(firstLine) ? firstLine.slice(0, 120) : fallback;
}

/** Only read on the client: the dialog content never renders on the server. */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const DIALOG_SIZES = '(max-width: 40rem) 100vw, 36rem';

function MediaView({
  media,
  alt,
  poster,
  autoPlay = false,
}: {
  media: InstagramMedia;
  alt: string;
  poster?: string;
  autoPlay?: boolean;
}): JSX.Element {
  if (media.kind === 'video') {
    return (
      <video
        className="ig-dialog-media"
        src={media.src}
        poster={poster}
        controls
        playsInline
        autoPlay={autoPlay && !prefersReducedMotion()}
        preload="metadata"
      />
    );
  }
  return <Image className="ig-dialog-media" src={media.src} alt={alt} fill sizes={DIALOG_SIZES} />;
}

interface CarouselProps {
  media: InstagramMedia[];
  alt: string;
}

/**
 * Scroll-snap track: native swipe on touch screens, chevrons and arrow keys
 * elsewhere. The current index follows the scroll position.
 */
function Carousel({ media, alt }: CarouselProps): JSX.Element {
  const text = useI18n().t.gallery.post;
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = media.length - 1;

  const goTo = (target: number): void => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(last, target));
    track.scrollTo({ left: clamped * track.clientWidth });
  };

  const handleScroll = (): void => {
    const track = trackRef.current;
    if (!track) return;
    const current = Math.round(track.scrollLeft / track.clientWidth);
    if (current !== index) setIndex(current);
  };

  // Arrow keys from anywhere in the dialog (focus starts on the close button),
  // except inside a video, whose arrows seek.
  useEffect(() => {
    const dialog = trackRef.current?.closest('dialog');
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const track = trackRef.current;
      if (!track) return;
      const current = Math.round(track.scrollLeft / track.clientWidth);
      const target = current + (event.key === 'ArrowLeft' ? -1 : 1);
      track.scrollTo({ left: Math.max(0, Math.min(last, target)) * track.clientWidth });
    };
    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [last]);

  // inert does not stop playback: pause the videos of the slides left behind.
  useEffect(() => {
    trackRef.current?.querySelectorAll<HTMLElement>('.ig-carousel-slide').forEach((slide, i) => {
      if (i !== index) slide.querySelector('video')?.pause();
    });
  }, [index]);

  return (
    <div
      className="ig-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={text.carousel}
    >
      <div ref={trackRef} className="ig-carousel-track" onScroll={handleScroll}>
        {media.map((item, i) => (
          // Off-screen slides are inert: no tabbing into a hidden video's controls.
          <div
            key={item.src}
            className="ig-carousel-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} ${text.slideOf} ${media.length}`}
            inert={i !== index}
          >
            <MediaView media={item} alt={alt} />
          </div>
        ))}
      </div>

      <p className="ig-carousel-counter" aria-live="polite">
        {index + 1} / {media.length}
      </p>
      {/* aria-disabled, not disabled: a disabled button would drop the focus. */}
      <button
        type="button"
        className="ig-carousel-nav ig-carousel-nav--prev"
        onClick={() => goTo(index - 1)}
        aria-disabled={index === 0}
        aria-label={text.previous}
      >
        <Icon name="prev" />
      </button>
      <button
        type="button"
        className="ig-carousel-nav ig-carousel-nav--next"
        onClick={() => goTo(index + 1)}
        aria-disabled={index === last}
        aria-label={text.next}
      >
        <Icon name="next" />
      </button>
    </div>
  );
}

interface InstagramCardProps {
  post: InstagramPost;
  className?: string;
}

/**
 * Gallery card of an Instagram post (cover, type badge, likes/comments).
 * A click opens a native <dialog> (focus trap, Escape and inert background
 * for free) showing the image, the carousel or the reel.
 * The card takes the width of its container and has no intrinsic width (the
 * cover is `fill`): put it in a sized box (grid cell, stretched flex item).
 */
export function InstagramCard({ post, className }: InstagramCardProps): JSX.Element {
  const { t, locale } = useI18n();
  const text = t.gallery.post;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const captionId = useId();
  const alt = altFromCaption(post.caption, text.coverAlt);
  const typeLabel = text.typeLabels[post.type];

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog?.open) dialog.close();
    };
  }, [isOpen]);

  // showModal() runs before the content renders: a cached image must not
  // measure itself inside a still-closed (display: none) dialog.
  const openDialog = (): void => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };

  // Every way of closing goes through close(), whose `close` event resets the state.
  const closeDialog = (): void => {
    dialogRef.current?.close();
  };

  // A click on the ::backdrop targets the <dialog> itself.
  const handleDialogClick = (event: MouseEvent<HTMLDialogElement>): void => {
    if (event.target === event.currentTarget) closeDialog();
  };

  return (
    <>
      <button
        type="button"
        className={cx('ig-card', className)}
        onClick={openDialog}
        aria-haspopup="dialog"
      >
        <Image
          className="ig-card-cover"
          src={post.cover}
          alt={alt}
          fill
          sizes="(max-width: 40rem) 50vw, 20rem"
        />
        {/* Icon only, so the badge covers less of the cover; the label stays
          for screen readers. */}
        <span className="ig-card-type ig-card-overlay" translate="no">
          <Icon name={post.type} />
          <span className="sr-only">{typeLabel}</span>
        </span>
        <span className="ig-card-stats ig-card-overlay">
          {post.likes !== null && (
            <span className="ig-card-stat">
              <Icon name="heart" />
              {formatInstagramCount(post.likes, locale)}
              <span className="sr-only"> {text.likes}</span>
            </span>
          )}
          <span className="ig-card-stat">
            <Icon name="comment" />
            {formatInstagramCount(post.comments, locale)}
            <span className="sr-only"> {text.comments}</span>
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="ig-dialog"
        aria-label={alt}
        aria-describedby={isOpen ? captionId : undefined}
        onClose={() => setIsOpen(false)}
        onClick={handleDialogClick}
      >
        {/* Rendered only while open: no media is loaded before the click. */}
        {isOpen && (
          <div className="ig-dialog-body">
            <button
              type="button"
              className="ig-dialog-close"
              onClick={closeDialog}
              aria-label={text.close}
              // The dialog is empty when showModal() runs: focus the first control
              // once the content exists, so keyboard users start inside it.
              autoFocus
            >
              <Icon name="close" />
            </button>

            <div className="ig-dialog-frame">
              {/* By media count, not type: a carousel whose videos were not
                  fetched can be left with a single photo. */}
              {post.media.length > 1 ? (
                <Carousel media={post.media} alt={alt} />
              ) : (
                <MediaView
                  media={post.media[0] ?? { kind: 'image', src: post.cover }}
                  alt={alt}
                  poster={post.cover}
                  autoPlay={post.type === 'reel'}
                />
              )}
              {/* Reel fetched without its video (the default): Instagram plays it. */}
              {post.type === 'reel' && post.media.length === 0 && (
                <a
                  className="ig-dialog-play"
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="play" />
                  {text.watchReel}
                  <span className="sr-only"> {text.newTab}</span>
                </a>
              )}
            </div>

            <p id={captionId} className="sr-only">
              {post.caption}
            </p>

            <div className="ig-dialog-footer">
              <span className="ig-card-type" translate="no">
                <Icon name={post.type} />
                {typeLabel}
              </span>
              <a
                className="ig-dialog-link"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {text.viewPost}
                <span className="sr-only"> {text.newTab}</span>
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
