"use client";

import Image from "next/image";
import { useI18n } from "@/app/i18n/provider";
import { artists } from "@/content/artists";

interface AboutSectionProps {
  id: string;
}

export function AboutSection({id}: AboutSectionProps) {
  const { t } = useI18n();
  // Names from the content, so the text follows the team.
  const names = artists.map((artist) => artist.name);
  const artistList = names.length > 1
    ? `${names.slice(0, -1).join(', ')} ${t.artists.and} ${names[names.length - 1]}`
    : names.join('');

  return (
    <section id={id} className="section">
      <div className="section-container-narrow">
        <div className="section-header">
          <h2 className="section-title">{t.about.title}</h2>
        </div>
        <Image
          src="/theboweryst-red-flower.png"
          alt=""
          width={600}
          height={600}
          className="about-section-flower"
          aria-hidden="true"
        />
        <p className="section-subtitle text-center">
          {t.about.description.replace('{artists}', artistList)}
        </p>
      </div>
    </section>
  );
}
