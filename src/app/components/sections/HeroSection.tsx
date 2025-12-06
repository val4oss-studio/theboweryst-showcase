"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/app/i18n/provider";
import { ArrowDown, Instagram, Facebook, MapPin } from "lucide-react";
import type { ShopEntity } from "@/domain/entities/shopEntity";

interface HeroSectionProps {
  shop: ShopEntity;
}

export function HeroSection({shop}: HeroSectionProps) {
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

  const openInstagram = () => {
    window.open(shop.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const openFacebook = () => {
    window.open(shop.facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const openMap = () => {
    window.open(shop.mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="home" className="section">
      <div className="section-header text-center">
        <h1 className="page-title">{shop.name}</h1>
        <p className="page-subtitle mt-4">{shop.description[locale]}</p>
        
        {/* Social Buttons */}
        <div className="hero-buttons">
          <button onClick={openInstagram}
                  className="hero-btn hero-btn-instagram"
          >
            <Instagram className="hero-btn-icon" />
            <span>{t.hero.instagram}</span>
          </button>

          <button onClick={openFacebook} className="hero-btn hero-btn-facebook">
            <Facebook className="hero-btn-icon" />
            <span>{t.hero.facebook}</span>
          </button>

          <button onClick={openMap} className="hero-btn hero-btn-location">
            <MapPin className="hero-btn-icon" />
            <span>{t.hero.location}</span>
          </button>
        </div>
      </div>

      <div className={`hero-arrow-indicator ${isScrolled ? 'scrolled' : ''}`}>
        <span className="text-sm text-muted-foreground mb-2">{"Scroll"}</span>
        <ArrowDown className="h-5 text-primary" />
      </div>

    </section>
  );
}
