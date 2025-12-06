"use client";

import { ArtistCard } from "@/app/components/layout/ArtistCard";
import { useI18n } from "@/app/i18n/provider";
import { ArtistEntity } from "@/domain/entities/artistEntity";

interface ArtistsSectionProps {
  artists: ArtistEntity[];
}

export function ArtistsSection({ artists }: ArtistsSectionProps) {
  const { t } = useI18n();

  return (
    <section id="artists" className="section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t.artists.title}</h2>
        </div>
        <div className="artists-grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.username} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  );
}
