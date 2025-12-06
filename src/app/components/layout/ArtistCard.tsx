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
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const { locale } = useI18n();
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
          alt={artist.username}
          width={400}
          height={400}
          className="card-image"
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{artist.username}</h3>
        <p className="card-subtitle">{artist.bio[locale]}</p>
      </div>
    </div>
  );
}
