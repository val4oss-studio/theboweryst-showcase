"use client";

import { useI18n } from "@/app/i18n/provider";

export function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="about" className="section">
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
