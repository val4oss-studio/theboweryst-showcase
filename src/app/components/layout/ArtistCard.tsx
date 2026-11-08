"use client";

import Image from "next/image";
import {
  getArtistInstagramUrl,
  getArtistPhoto,
  type Artist,
} from "@/content/artists";
import { formatGuestDates, type Guest } from "@/content/guests";
import { shop } from "@/content/shop";
import { useI18n } from "@/app/i18n/provider";

interface ArtistCardProps {
  artist: Artist;
  /** Set for a guest spot: shows the guest badge and her dates. */
  guest?: Guest;
  priority?: boolean;
}

export function ArtistCard({ artist, guest, priority }: ArtistCardProps) {
  const { t, locale } = useI18n();
  const instagramUrl = getArtistInstagramUrl(artist);
  const altTemplate = guest ? t.artists.guestAlt : t.artists.cardAlt;

  const handleClick = () => {
    window.open(instagramUrl, "_blank");
  };

  return (
    <div
      className={`card${guest ? " card--guest" : ""}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-image-wrapper">
        <Image
          src={getArtistPhoto(artist)}
          alt={altTemplate
            .replace('{name}', artist.name)
            .replace('{shop}', shop.name)}
          width={400}
          height={400}
          className="card-image"
          priority={priority}
        />
        {guest && (
          <span className="card-guest-badge">{t.artists.guest}</span>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{artist.name}</h3>
        {guest && (
          <p className="card-guest-dates">
            {t.artists.guestDates.replace('{dates}', formatGuestDates(guest, locale))}
          </p>
        )}
        {/* A real link: crawlers do not follow the card's onClick. */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-handle"
          onClick={(event) => event.stopPropagation()}
        >
          @{artist.instagram}
        </a>
        <p className="card-subtitle">{artist.bio[locale]}</p>
      </div>
    </div>
  );
}
