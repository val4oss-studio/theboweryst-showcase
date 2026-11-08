"use client";

import Image from "next/image";
import { ArtistCard } from "@/app/components/layout/ArtistCard";
import { useI18n } from "@/app/i18n/provider";
import type { Artist } from "@/content/artists";
import type { Guest } from "@/content/guests";

interface ArtistsSectionProps {
  id: string;
  artists: Artist[];
  /** Current and upcoming guest spots, shown after the residents. */
  guests: Guest[];
}

export function ArtistsSection({ id, artists, guests }: ArtistsSectionProps) {
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
          {artists.map((artist, index) => (
            <ArtistCard key={artist.id} artist={artist} priority={index === 0} />
          ))}
          {guests.map((guest) => (
            <ArtistCard key={`${guest.id}-${guest.from}`} artist={guest} guest={guest} />
          ))}
        </div>
      </div>
    </section>
  );
}
