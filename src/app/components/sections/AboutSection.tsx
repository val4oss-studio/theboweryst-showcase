"use client";

import Image from "next/image";
import { useI18n } from "@/app/i18n/provider";

interface AboutSectionProps {
  id: string;
}

export function AboutSection({id}: AboutSectionProps) {
  const { t } = useI18n();

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
          {t.about.description}
        </p>
      </div>
    </section>
  );
}
