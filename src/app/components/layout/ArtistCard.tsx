"use client";

import Image from "next/image";
import type { ArtistEntity } from "@/domain/entities/artistEntity";
import {
  getArtistInstagramUrl,
  getArtistProfileImage,
} from "@/domain/entities/artistEntity";
import { useI18n } from "@/app/i18n/provider";

interface ArtistCardProps {
  artist: ArtistEntity;
  shopName: string;
  priority?: boolean;
}

export function ArtistCard({ artist, shopName, priority }: ArtistCardProps) {
  const { t, locale } = useI18n();
  const instagramUrl = getArtistInstagramUrl(artist);
  const imageUrl = getArtistProfileImage(artist);

  const handleClick = () => {
    if (instagramUrl) {
      window.open(instagramUrl, "_blank");
    }
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{ cursor: instagramUrl ? 'pointer' : 'default' }}
    >
      <div className="card-image-wrapper">
        <Image
          src={imageUrl}
          alt={t.artists.cardAlt
            .replace('{name}', artist.username)
            .replace('{shop}', shopName)}
          width={400}
          height={400}
          className="card-image"
          priority={priority}
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{artist.username}</h3>
        {instagramUrl && (
          // A real link: crawlers do not follow the card's onClick.
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-handle"
            onClick={(event) => event.stopPropagation()}
          >
            @{artist.instagramName}
          </a>
        )}
        <p className="card-subtitle">{artist.bio[locale]}</p>
      </div>
    </div>
  );
}
