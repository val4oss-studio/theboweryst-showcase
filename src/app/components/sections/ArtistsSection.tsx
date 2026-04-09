"use client";

import Image from "next/image";
import { ArtistCard } from "@/app/components/layout/ArtistCard";
import { useI18n } from "@/app/i18n/provider";
import { ArtistEntity } from "@/domain/entities/artistEntity";

interface ArtistsSectionProps {
  id: string;
  artists: ArtistEntity[];
}

export function ArtistsSection({ id, artists }: ArtistsSectionProps) {
  const { t } = useI18n();

  return (
    <section id={id} className="section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t.artists.title}</h2>
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
          {artists.map((artist) => (
            <ArtistCard key={artist.username} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  );
}
