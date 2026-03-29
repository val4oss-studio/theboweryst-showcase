"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/app/i18n/provider";
import { ArrowDown, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import type { ShopEntity } from "@/domain/entities/shopEntity";

interface HeroSectionProps {
  id: string;
  shop: ShopEntity;
}

export function HeroSection({id, shop}: HeroSectionProps) {
  const { t, locale } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id={id} className="section">
      <div className="section-header text-center">
        <h1 className="page-title">{shop.name}</h1>
        <p className="page-subtitle mt-4">{shop.description[locale]}</p>
        
        {/* Social Buttons */}
        <div className="hero-buttons">
          <a
            href={shop.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-instagram"
          >
            <FaInstagram className="hero-btn-icon" />
            <span>{t.hero.instagram}</span>
          </a>

          <a
            href={shop.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-facebook"
          >
            <FaFacebook className="hero-btn-icon" />
            <span>{t.hero.facebook}</span>
          </a>

          <a
            href={shop.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-btn hero-btn-location"
          >
            <MapPin className="hero-btn-icon" />
            <span>{t.hero.location}</span>
          </a>
        </div>
      </div>

      <div className={`hero-arrow-indicator ${isScrolled ? 'scrolled' : ''}`}>
        <span className="text-sm text-muted-foreground mb-2">{"Scroll"}</span>
        <ArrowDown className="h-5 text-primary" />
      </div>

    </section>
  );
}
