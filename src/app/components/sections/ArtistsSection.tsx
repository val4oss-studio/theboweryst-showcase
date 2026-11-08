"use client";

import Image from "next/image";
import { ArtistCard } from "@/app/components/layout/ArtistCard";
import { useI18n } from "@/app/i18n/provider";
import { ArtistEntity } from "@/domain/entities/artistEntity";

interface ArtistsSectionProps {
  id: string;
  shopName: string;
  artists: ArtistEntity[];
}

export function ArtistsSection({ id, shopName, artists }: ArtistsSectionProps) {
  const { t } = useI18n();
  const names = artists.map((artist) =>
    artist.instagramName
      ? `${artist.username} (@${artist.instagramName})`
      : artist.username
  );
  const artistList = names.length > 1
    ? `${names.slice(0, -1).join(', ')} ${t.artists.and} ${names[names.length - 1]}`
    : names.join('');

  return (
    <section id={id} className="section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t.artists.title}</h2>
          <p className="section-intro">
            {t.artists.intro
              .replace('{name}', shopName)
              .replace('{artists}', artistList)}
          </p>
        </div>
        <Image
          src="/theboweryst-yellow-flower.png"
          alt=""
          width={600}
          height={600}
          className="artists-section-flower"
          aria-hidden="true"
        />
        <div className="artists-grid">
          {artists.map((artist, index) => (
            <ArtistCard
              key={artist.username}
              artist={artist}
              shopName={shopName}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
