"use client";

import { useI18n } from "@/app/i18n/provider";
import { MapPin, Instagram, Facebook } from "lucide-react";
import type { ShopEntity } from "@/domain/entities/shopEntity";
import type {ArtistEntity} from "@/domain/entities/artistEntity";
import { getArtistInstagramUrl } from "@/domain/entities/artistEntity";

interface ContactSectionProps {
  id: string;
  shop: ShopEntity;
  artists: ArtistEntity[];
}

export function ContactSection({ id, shop, artists }: ContactSectionProps) {
  const { t, locale } = useI18n();

  const handleClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <section id={id} className="section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">{t.contact.title}</h2>
        </div>

        <div className="contact-layout">
        
          {/* Location & Hours Card */}
          <div className="contact-card contact-shop-card">
            <div className="contact-card-icon">
              <MapPin size={32} />
            </div>
            <h3 className="contact-card-title">{shop.name}</h3>
            <p className="contact-card-text">{shop.addressStreet}</p>
            <p className="contact-card-text">
              {shop.addressZip} {shop.addressCity}
            </p>
            <p className="contact-card-text contact-card-hours">
              {shop.scheduleWeekdays[locale]}
            </p>
            <p className="contact-card-text contact-card-hours">
              {shop.scheduleWeekend[locale]}
            </p>
            <div className="contact-shop-actions">
              <button
                onClick={() => handleClick(shop.instagramUrl)}
                className="hero-btn hero-btn-instagram"
              >
                <Instagram className="hero-btn-icon" />
                <span>@{shop.instagramUsername}</span>
              </button>
              <button
                onClick={() => handleClick(shop.facebookUrl)}
                className="hero-btn hero-btn-facebook"
              >
                <Facebook className="hero-btn-icon" />
                <span>{shop.facebookUsername}</span>
              </button>
              <button
                onClick={() => handleClick(shop.mapUrl)}
                className="hero-btn"
              >
                <MapPin className="hero-btn-icon" />
                <span>{t.contact.openMap}</span>
              </button>
            </div>
          </div>

          {/* Instagram Cards */}
          <div className="contact-artists-grid">
            {artists.map((artist) => {
              const igUrl = getArtistInstagramUrl(artist);
              if (!igUrl) return null;
              return (
                <div
                  key={artist.username}
                  className="contact-card contact-card-clickable"
                  onClick={() => handleClick(igUrl)}
                >
                  <div className="contact-card-icon">
                    <Instagram size={32} />
                  </div>
                  <h3 className="contact-card-title">{artist.username}</h3>
                  <p className="contact-card-text">@{artist.instagramName}</p>
                  <div className="contact-card-action">
                    {t.contact.followOn} Instagram
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
