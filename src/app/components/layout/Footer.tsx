'use client';

import { useI18n } from '@/app/i18n/provider';
import { Instagram, Facebook, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import type { ShopEntity } from '@/domain/entities/shopEntity';
import type { ArtistEntity } from '@/domain/entities/artistEntity';
import { getArtistInstagramUrl } from '@/domain/entities/artistEntity';

interface FooterProps {
  shop: ShopEntity;
  artists: ArtistEntity[];
}

export function Footer({ shop, artists }: FooterProps) {
  const { t, locale } = useI18n();

  const quickLinks = [
    { name: t.nav.about, href: '#about' },
    { name: t.nav.artists, href: '#artists' },
    { name: t.nav.gallery, href: '#gallery' },
    { name: t.nav.contact, href: '#contact' },
  ];
  

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo & Description */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <Image
              src="/logo.jpg"
              alt="The Bowery Street Logo"
              width={80}
              height={80}
              className="footer-logo-img"
            />
          </div>
          <h3 className="footer-brand-name">{shop.name}</h3>
          <p className="footer-description">{shop.description[locale]}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">{t.footer.quickLinks}</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="footer-link">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-title">{t.footer.contactInfo}</h4>
          <ul className="footer-info">
            <li className="footer-info-item">
              <MapPin size={18} />
              <a
                href={shop.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                {shop.addressStreet}<br />{shop.addressZip} {shop.addressCity}
              </a>
            </li>
            <li className="footer-info-item">
              <Clock size={18} />
              <span>
                {shop.scheduleWeekdays[locale]}<br />
                {shop.scheduleWeekend[locale]}
              </span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4 className="footer-title">{t.footer.followUs}</h4>
          <ul className="footer-social">
            {/* Shop Instagram */}
            <li>
              <a
                href={shop.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={shop.name}
              >
                <Instagram size={20} />
                <span>{shop.name}</span>
              </a>
            </li>
            {/* Shop Facebook */}
            <li>
              <a
                href={shop.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label={shop.facebookUsername}
              >
                <Facebook size={20} />
                <span>{shop.facebookUsername}</span>
              </a>
            </li>
            {/* Artist Instagrams (from DB) */}
            {artists.map((artist) => {
              const igUrl = getArtistInstagramUrl(artist);
              if (!igUrl) return null;
              return (
                <li key={artist.username}>
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label={artist.username}
                  >
                    <Instagram size={20} />
                    <span>{artist.username}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} {shop.name}. {t.footer.rights}
        </p>
        <div className="footer-credits">
          <span>{t.footer.madeWith} ❤️ {t.footer.inLorient}</span>
        </div>
      </div>

    </footer>
  );
}
