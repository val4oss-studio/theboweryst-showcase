"use client";

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
        <p className="section-subtitle text-center">
          {t.about.description}
        </p>
      </div>
    </section>
  );
}
